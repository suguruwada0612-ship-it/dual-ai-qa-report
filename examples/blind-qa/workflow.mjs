import { createHash } from 'node:crypto';

export const notice = '架空データによる手順デモ。実LLMを実行せず、実際の評価者の独立性や製品品質を実証しない。';
const rubric = [
  { id: 'constraints', description: '入力の明示条件を守り、未指定の事実や約束を加えていないか。' },
  { id: 'usability', description: '依頼に沿った完成文として、そのまま使えるか。' },
];

export const sha256 = text => createHash('sha256').update(text, 'utf8').digest('hex');
const serialize = data => JSON.stringify(data, null, 2) + '\n';
const seal = data => {
  const text = serialize(data);
  return { text, sha256: sha256(text) };
};
const requireText = value => {
  if (typeof value !== 'string' || value.trim().length === 0) throw new Error('本文は空でない文字列が必要です。');
  return value;
};

function blindCases(source) {
  if (!Array.isArray(source?.cases) || !source.cases.length) throw new Error('架空ケースが必要です。');
  // Allowlist at every level: no spread of source objects, metadata or existing IDs.
  return source.cases.map((entry, i) => {
    if (!Array.isArray(entry.turns) || !entry.turns.length) throw new Error('会話が必要です。');
    return {
      caseId: `case-${String(i + 1).padStart(3, '0')}`,
      turns: entry.turns.map((turn, j) => ({
        turn: j + 1,
        input: requireText(turn.input),
        response: requireText(turn.response),
      })),
    };
  });
}

function reviewCopy(review, cases) {
  const expected = new Set(cases.flatMap(c => rubric.map(r => `${c.caseId}/${r.id}`)));
  if (!Array.isArray(review?.assessments)) throw new Error('評価一覧が必要です。');
  const assessments = review.assessments.map(row => {
    const key = `${row.caseId}/${row.criterion}`;
    if (!expected.delete(key)) throw new Error('評価対象に重複または未知の組み合わせがあります。');
    if (!['pass', 'fail', 'not-verified'].includes(row.verdict)) throw new Error('評価の判定値が不正です。');
    if (!['none', 'low', 'medium', 'high'].includes(row.severity)) throw new Error('重要度が不正です。');
    if ((row.verdict === 'fail') !== (row.severity !== 'none')) throw new Error('failだけに重要度を指定してください。');
    return { caseId: row.caseId, criterion: row.criterion, verdict: row.verdict, severity: row.severity, note: requireText(row.note) };
  });
  if (expected.size) throw new Error('未評価の観点があります。未検証の場合もnot-verifiedを明記してください。');
  return { assessments };
}

export class BlindQaWorkflow {
  #cases;
  #phase = 'created';
  #first;
  #blind;

  constructor(source) {
    this.#cases = blindCases(source);
  }

  freezeCodexReview(review) {
    if (this.#phase !== 'created') throw new Error('事前評価は最初に一度だけ固定できます。');
    this.#first = seal({ simulation: true, notice, role: 'Codex役（固定した架空評価）', ...reviewCopy(review, this.#cases) });
    this.#phase = 'first-frozen';
    return { ...this.#first };
  }

  prepareBlindInput() {
    if (this.#phase !== 'first-frozen') throw new Error('ブラインド入力は事前評価を固定した後に一度だけ作成できます。');
    this.#blind = seal({ schemaVersion: 1, simulation: true, notice, rubric, cases: this.#cases });
    this.#phase = 'blind-issued';
    return { ...this.#blind };
  }

  compare({ frozenFirstText, blindInputText, secondReview }) {
    if (this.#phase !== 'blind-issued') throw new Error('比較には事前評価の固定とブラインド入力の作成が必要です。');
    if (sha256(frozenFirstText) !== this.#first.sha256) throw new Error('事前評価のハッシュ不一致：変更または改ざんを検出しました。');
    if (sha256(blindInputText) !== this.#blind.sha256) throw new Error('ブラインド入力のハッシュ不一致：変更または改ざんを検出しました。');
    const first = JSON.parse(frozenFirstText);
    const second = reviewCopy(secondReview, this.#cases);
    const secondByKey = new Map(second.assessments.map(row => [`${row.caseId}/${row.criterion}`, row]));
    const rows = first.assessments.map(left => {
      const right = secondByKey.get(`${left.caseId}/${left.criterion}`);
      return {
        caseId: left.caseId,
        criterion: left.criterion,
        first: { verdict: left.verdict, severity: left.severity, note: left.note },
        second: { verdict: right.verdict, severity: right.severity, note: right.note },
        judgmentDiffers: left.verdict !== right.verdict || left.severity !== right.severity,
      };
    });
    this.#phase = 'compared';
    return {
      simulation: true,
      notice,
      verified: { firstSha256: this.#first.sha256, blindSha256: this.#blind.sha256 },
      differingRows: rows.filter(row => row.judgmentDiffers).length,
      comparisonUnit: 'ケースと観点の組み合わせ。重大度の合計やユニーク不具合数ではない。',
      rows,
      humanDecision: '未実施。評価差の根拠を人間が確認し、修正・再評価・採用を判断する必要がある。',
    };
  }
}
