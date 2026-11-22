# 更新手順

1. 資料の基準日・参照コミットを確定する。開発リポジトリは読み取り専用とし、公開用リポジトリで編集する。
2. `evidence/data.json` の台帳を更新する。同一実行の重複記載を足さない。主要テストの延べケース数、記録実行回数、最新ケース数、独立QAの起動・取得・未取得、Human Gateの修正対応、実AI通信の単位を維持する。
3. 新しい監査を行った場合と、古い記録を新しく確認した場合を分ける。監査所見の重大度を全期間で単純合算しない。修正実装と実応答品質の実測改善を分ける。Human Gateの記述はIssue本文の観察・判断を直接確認し、STATUS・監査・実品質の結果と対応させて `evidence/human-gate-chronology.md` を更新する。依頼だけを実施済みとは扱わない。
4. 原資料から公開に必要な抜粋・要約だけを作る。原ログ、秘密、個人・顧客情報、元の `.git` をコピーしない。公開するハッシュは必要最小限にし、セッション識別子を載せない。
5. `report.md`、`press.md`、`evidence.md`、`README.md` の数値・日付・判断を同期する。プレスリリースの連絡先は公式サイトの最新情報を確認する。訂正は補正理由を残す。
6. `node scripts/build.mjs` と `node scripts/check.mjs` を実行する。`node scripts/serve.mjs` でPC幅とスマートフォン幅の本文・図・表・リンクを実ブラウザで確認する。
7. `git diff` と `git status --short` で公開予定ファイルを確認する。このリポジトリだけでコミットし、`main` にpushする。原稿だけでなく生成したHTML・CSVもコミットする。
8. GitHubのPagesビルド完了後、公開URL、プレスリリース、根拠資料、図、Markdown、CSVを実際に開く。`VERIFICATION.md` に確認日時、対象、結果、制約を追記する。

## 公開設定

GitHubの Settings → Pages → Deploy from a branch → `main` / `/ (root)`。独自ドメインやバックエンドは不要です。`.nojekyll` により静的ファイルをそのまま配信します。

## 集計で維持する注意

- 2,970件は37行の主要実行記録の延べケース数。固定受入の別実行は重複加算しない。
- 最新200ケースは全期間のユニークなテスト種類数ではない。
- 独立QAの結果取得は合格と同義ではない。結果未取得2回を判定済みにしない。
- Human Gate 10対応は改善の対応単位で、10件の受入合格を意味しない。
- Cloudflare実通信は下限。Codex・Claudeの開発/監査用通信とは混ぜない。
- 今回の公開サイトの表示・リンク検証は、Classroom DX製品の過去のQA集計へ足さない。

## SNS共有カードの更新

本番画像は `assets/ogp-dual-ai-qa.png`（1200×630）。編集可能なSVGと、同じ内容のPNG/SVGを生成する `scripts/render-ogp.ps1` を保存しています。WindowsのYu Gothicを使用し、`powershell -NoProfile -File scripts/render-ogp.ps1` で再生成後、通常のbuild/checkを実行します。SVGだけを編集した場合はPNGにも同じ変更を反映してください。SNS側のキャッシュ更新には時間がかかる場合があります。

## メディア素材とサンプル

- 画像・動画の内容は `media-src/comparison.json` と `media-src/scenes.json` を更新し、`scripts/render-media.ps1` でPNG/SVG/MP4を再生成します。依存関係・台本は `media-src/README.md`。基準日と制作日は区別します。
- `media.md` と `examples/blind-qa/README.md` は通常のbuildで `media.html` / `sample.html` に反映します。既存レポート本文や集計を変更する必要はありません。
- サンプル変更後は `node --test examples/blind-qa/workflow.test.mjs` とデモを実行。生成された `output/` は公開しません。実AI呼び出しを追加する場合、このデモの範囲外です。
- 動画は実際に再生し、テロップ・再現表示・基準日・残課題を確認。資料の別担当QAと公開後のHTTP・ファイル一致を `VERIFICATION.md` に記録します。
