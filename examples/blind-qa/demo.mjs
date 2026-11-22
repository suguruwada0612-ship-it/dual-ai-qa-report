import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { BlindQaWorkflow, notice, sha256 } from './workflow.mjs';
import { source, codexRoleReview, separateReviewerRoleReview } from './fixtures.mjs';

const directory = fileURLToPath(new URL(`./output/run-${randomUUID()}/`, import.meta.url));
await mkdir(join(directory, 'custodian'), { recursive: true });
await mkdir(join(directory, 'reviewer'), { recursive: true });
const workflow = new BlindQaWorkflow(source);
const first = workflow.freezeCodexReview(codexRoleReview);
const firstPath = join(directory, 'custodian', 'first-review.json');
await writeFile(firstPath, first.text, { flag: 'wx' });

const blind = workflow.prepareBlindInput();
const blindPath = join(directory, 'reviewer', 'blind-input.json');
await writeFile(blindPath, blind.text, { flag: 'wx' });

// A handwritten second evaluation stands in for a separate reviewer. No API call.
const secondText = JSON.stringify({ simulation: true, notice, ...separateReviewerRoleReview }, null, 2) + '\n';
const secondPath = join(directory, 'reviewer', 'second-review.json');
await writeFile(secondPath, secondText, { flag: 'wx' });
const comparison = workflow.compare({
  frozenFirstText: await readFile(firstPath, 'utf8'),
  blindInputText: await readFile(blindPath, 'utf8'),
  secondReview: JSON.parse(await readFile(secondPath, 'utf8')),
});
comparison.sampleNextStep = 'この架空例ではケース2の約束部分を修正候補にする。修正・再評価・採用判断は実施していない。';
await writeFile(join(directory, 'comparison.json'), JSON.stringify(comparison, null, 2) + '\n', { flag: 'wx' });
await writeFile(join(directory, 'manifest.json'), JSON.stringify({
  simulation: true,
  notice,
  steps: ['事前評価を固定', 'ブラインド入力を作成', '架空の別評価を読み込む', '保持ハッシュと照合して比較'],
  hashes: { firstReview: first.sha256, blindInput: blind.sha256, secondReview: sha256(secondText) },
  limitation: '実行中に保持したハッシュとの一致確認。外部の時刻証明・署名・評価者の隔離は行っていない。',
}, null, 2) + '\n', { flag: 'wx' });
console.log(notice);
console.log(`判定または重要度が異なる行：${comparison.differingRows} / ${comparison.rows.length}（ケース×観点）`);
console.log(`出力先：${directory}`);
