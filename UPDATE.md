# 更新手順

「DX・AXの継続運用を支える Dual-AI QA 技術実証レポート」は、業務改善と継続運用に向けた開発・品質検証プロセスを公開する資料です。現場の要件定義、ローカル環境での実装、CodexとClaude Codeの連携・独立QA、Human GateによるUI・業務評価、修正・再検証を軸に更新します。Human Gateを最後の一度だけの承認とせず、要件・実装へ差し戻す工程として記述します。

1. 実証の集計基準日・参照コミットと、今回のサイト更新日を区別する。現在の集計基準日は2026年11月22日、訴求・共有画像の改訂日は2026年11月23日。開発リポジトリは読み取り専用とし、公開用リポジトリで編集する。
2. 新しい根拠がある場合だけ `evidence/data.json` の台帳を更新する。訴求・デザイン・共有設定だけの変更で既存累計を増やさない。同一実行の重複記載を足さず、主要テストの延べケース数、記録実行回数、最新ケース数、独立QAの起動・取得・未取得、Human Gateの修正対応、実AI通信の単位を維持する。
3. 新しい監査を行った場合と、古い記録を新しく確認した場合を分ける。監査所見の重大度を全期間で単純合算しない。修正実装と実応答品質の実測改善を分ける。Human Gateの記述はIssue本文の観察・判断を直接確認し、STATUS・監査・実品質の結果と対応させて `evidence/human-gate-chronology.md` を更新する。依頼だけを実施済みとは扱わない。
4. 原資料から公開に必要な抜粋・要約だけを作る。原ログ、秘密、個人・顧客情報、元の `.git` をコピーしない。公開するハッシュは必要最小限にし、セッション識別子を載せない。
5. `report.md`、`press.md`、`evidence.md`、`media.md`、`README.md` と生成元の紹介文・数値・日付・判断を同期する。無停止稼働、長期安定運用、業務時間削減・教育効果を未測定のまま達成・保証したと書かない。プレスリリースの連絡先は公式サイトの最新情報を確認する。訂正は補正理由を残す。
6. `node scripts/build.mjs` と `node scripts/check.mjs` を実行する。`node scripts/serve.mjs` でPC幅とスマートフォン幅の本文・図・表・リンクを実ブラウザで確認する。
7. `git diff` と `git status --short` で公開予定ファイルを確認する。このリポジトリだけでコミットし、`main` にpushする。原稿だけでなく生成したHTML・CSVもコミットする。
8. GitHubのPagesビルド完了後、公開URL、プレスリリース、根拠資料、素材一覧、画像、Markdown、CSVを実際に開く。公開HTMLのタイトル・説明・共有画像参照と、公開画像が完成ファイルと一致することを確認する。`VERIFICATION.md` に確認日時、対象、結果、制約を追記する。SNS各社での実表示を確認していない場合、その旨を分けて記録する。

## 公開設定

GitHubの Settings → Pages → Deploy from a branch → `main` / `/ (root)`。独自ドメインやバックエンドは不要です。`.nojekyll` により静的ファイルをそのまま配信します。

## 集計で維持する注意

- 2,970件は37行の主要実行記録の延べケース数。固定受入の別実行は重複加算しない。
- 最新200ケースは固定受入5ケースを含む。全期間のユニークなテスト種類数ではない。
- 独立QAは少なくとも43起動・41結果取得・2未取得。結果取得は合格と同義ではなく、結果未取得2回を判定済みにしない。
- Human Gate 10対応は改善の対応単位で、10件の受入合格を意味しない。
- Cloudflare実通信は下限。Codex・Claudeの開発/監査用通信とは混ぜない。
- 公開記録上の通常モデルはMistral、Gemmaは未採用。Issue #8後の実応答品質は再検証待ちであり、コードQA合格を実品質・実務上の受入合格に置き換えない。
- 今回の公開サイトの表示・リンク検証は、Classroom DX製品の過去のQA集計へ足さない。

## SNS共有カードの更新

通常投稿用の正方形は `assets/media/dual-ai-qa-dx-square.png` / `.jpg` / `.svg`（1080×1080）、リンク共有用の横長は `assets/ogp-dual-ai-qa-dx.png` / `.svg`（1200×630）です。文言・配置の設定は `media-src/dx-social.json`、再生成コードは `scripts/render-dx-social.ps1`。旧OGP画像とはファイル名を分けています。

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/render-dx-social.ps1
node scripts/build.mjs
node scripts/check.mjs
```

PNG・JPEGを実際に開き、日本語・固有名詞・工程の循環、寸法、容量、sRGB、不透明背景を確認します。投稿用PNG・JPEGは各5MB未満にし、スマートフォン幅相当でも見出しと主要な役割が読めるか確認します。SVGだけを変更した場合も設定と書き出し画像へ同じ修正を戻してください。

トップ・プレス・素材一覧等の初期HTMLで、title、description、canonical、OGP一式、Xカード一式を確認します。`og:image` と `twitter:image` は新しい横長PNGの公開HTTPS絶対URL、`twitter:card` は `summary_large_image` とします。画像の種類・幅・高さ・代替テキストも設定し、canonicalとog:urlに追跡パラメータを入れません。SNS側のキャッシュが即時更新されたとは、実際に確認するまで報告しません。

## メディア素材とサンプル

- `media.md` と `examples/blind-qa/README.md` は通常のbuildで `media.html` / `sample.html` に反映します。既存レポート本文や集計を変更する必要はありません。
- サンプル変更後は `node --test examples/blind-qa/workflow.test.mjs` とデモを実行。生成された `output/` は公開しません。実AI呼び出しを追加する場合、このデモの範囲外です。
- 既存のIssue #5比較画像と共用の生成処理を維持します。削除済みの紹介動画・専用素材・再生UI・動画案内は復活させず、過去の検証履歴は残します。
