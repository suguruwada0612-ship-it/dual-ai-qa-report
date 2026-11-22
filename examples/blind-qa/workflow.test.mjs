import test from 'node:test';
import assert from 'node:assert/strict';
import { BlindQaWorkflow } from './workflow.mjs';
import { source, codexRoleReview, separateReviewerRoleReview } from './fixtures.mjs';

function issued() {
  const workflow = new BlindQaWorkflow(source);
  const first = workflow.freezeCodexReview(codexRoleReview);
  const blind = workflow.prepareBlindInput();
  return { workflow, first, blind };
}

test('許可項目だけを渡し、階層ごとのモデル名・元ID・先行所見を漏らさない', () => {
  const injected = structuredClone(source);
  injected.newMetadata = 'DO-NOT-PUBLISH-ROOT';
  injected.cases[0].review = 'DO-NOT-PUBLISH-CASE';
  injected.cases[0].turns[0].model = 'DO-NOT-PUBLISH-TURN';
  const workflow = new BlindQaWorkflow(injected);
  workflow.freezeCodexReview(codexRoleReview);
  const blind = workflow.prepareBlindInput();
  const parsed = JSON.parse(blind.text);
  assert.deepEqual(Object.keys(parsed).sort(), ['cases', 'notice', 'rubric', 'schemaVersion', 'simulation']);
  assert.deepEqual(Object.keys(parsed.cases[0]).sort(), ['caseId', 'turns']);
  assert.deepEqual(Object.keys(parsed.cases[0].turns[0]).sort(), ['input', 'response', 'turn']);
  assert.doesNotMatch(blind.text, /FICTIONAL-MODEL|internal-example|DO-NOT-PUBLISH|previousScore|previousAssessment|Codex役|例文の補完/);
  assert.equal(parsed.cases[0].turns[0].response, source.cases[0].turns[0].response);
});

test('入力または事前評価の変更を検出し、正しい原本に戻すまで比較しない', () => {
  const { workflow, first, blind } = issued();
  const args = { frozenFirstText: first.text, blindInputText: blind.text, secondReview: separateReviewerRoleReview };
  assert.throws(() => workflow.compare({ ...args, blindInputText: blind.text.replace('ごちそう', '電話') }), /ブラインド入力のハッシュ不一致/);
  assert.throws(() => workflow.compare({ ...args, frozenFirstText: first.text.replace('"low"', '"high"') }), /事前評価のハッシュ不一致/);
  assert.equal(workflow.compare(args).differingRows, 2);
});

test('事前固定→入力配布→比較の順序を守り、再固定・二重比較を拒否する', () => {
  const workflow = new BlindQaWorkflow(source);
  assert.throws(() => workflow.prepareBlindInput(), /事前評価を固定した後/);
  assert.throws(() => workflow.compare({}), /比較には事前評価/);
  const mutableReview = structuredClone(codexRoleReview);
  const first = workflow.freezeCodexReview(mutableReview);
  mutableReview.assessments[2].severity = 'high';
  assert.throws(() => workflow.freezeCodexReview(mutableReview), /最初に一度だけ/);
  assert.throws(() => workflow.compare({}), /比較には事前評価/);
  const blind = workflow.prepareBlindInput();
  const args = { frozenFirstText: first.text, blindInputText: blind.text, secondReview: separateReviewerRoleReview };
  assert.equal(workflow.compare(args).rows[2].first.severity, 'low');
  assert.throws(() => workflow.compare(args), /比較には事前評価/);
});

test('同じ観点の判定と重要度を対応させ、評価順が違っても差を比較する', () => {
  const { workflow, first, blind } = issued();
  const secondReview = { assessments: [...separateReviewerRoleReview.assessments].reverse() };
  const result = workflow.compare({ frozenFirstText: first.text, blindInputText: blind.text, secondReview });
  assert.equal(result.simulation, true);
  assert.equal(result.differingRows, 2);
  assert.deepEqual(result.rows.map(r => [r.caseId, r.criterion, r.judgmentDiffers]), [
    ['case-001', 'constraints', false], ['case-001', 'usability', false],
    ['case-002', 'constraints', true], ['case-002', 'usability', true],
  ]);
  assert.equal(result.rows[2].first.severity, 'low');
  assert.equal(result.rows[2].second.severity, 'medium');
  assert.equal(result.rows[3].first.verdict, 'pass');
  assert.equal(result.rows[3].second.verdict, 'fail');
  assert.match(result.comparisonUnit, /ユニーク不具合数ではない/);
});

test('欠けた評価や重複した評価を比較から除外せず、入力エラーとして止める', () => {
  const { workflow, first, blind } = issued();
  const args = { frozenFirstText: first.text, blindInputText: blind.text };
  assert.throws(() => workflow.compare({ ...args, secondReview: { assessments: separateReviewerRoleReview.assessments.slice(1) } }), /未評価の観点/);
  assert.throws(() => workflow.compare({ ...args, secondReview: { assessments: [...separateReviewerRoleReview.assessments, separateReviewerRoleReview.assessments[0]] } }), /重複/);
});
