# DX・AXの継続運用を支える Dual-AI QA 技術実証レポート

**業務を止めないDXへ。AIと人で、使い続けられる品質を。**

こむぎパソコン教室（岩手県北上市）が、現場の業務に合わせた要件定義、ローカル環境での実装、CodexとClaude Codeの連携・独立QA、人によるUI・業務評価、修正・再検証を公開する技術紹介用リポジトリです。DX（デジタル技術による業務の見直し）とAX（AI活用による業務の見直し）の継続運用を支えることを目指しています。

**Codex × Claude Code × Human Gate**。Human Gateは現場担当者が実際の業務・UI・応答を評価し、必要なら要件や実装へ差し戻す工程です。最後の一度だけの承認ではありません。KOMUGI Classroom DXでの保存・起動・学習順序・AI応答の改善を事例に、何を確認して使えると判断するかを示します。[Issue #1〜#8の公開用経緯](evidence/human-gate-chronology.md)では、依頼と実施結果を分けています。

無停止稼働・長期安定運用を達成した記録ではなく、業務時間削減や教育効果の定量測定も未完了です。QA（仕様・品質の確認）の工程と、その確認範囲を紹介します。

- [技術実証レポート](https://suguruwada0612-ship-it.github.io/dual-ai-qa-report/)
- [報道向けプレスリリース](https://suguruwada0612-ship-it.github.io/dual-ai-qa-report/press.html)
- [集計台帳・公開監査抜粋](https://suguruwada0612-ship-it.github.io/dual-ai-qa-report/evidence.html)
- [SNS共有用画像・実証事例・最小QAサンプル](https://suguruwada0612-ship-it.github.io/dual-ai-qa-report/media.html)

## 集計基準

実証の集計基準日：2026年11月22日 JST。開発資料の参照コミットは `47d820885f6f5fd28a225fbf8829a231550d2044`。サイト・原稿・共有画像の更新日：2026年11月23日。今回の改訂を新たな製品試験として集計していません。

主要自動テスト37回分・延べ2,970件は同じケースの繰り返しを含み、最新200ケースには固定受入5ケースを含みます。独立QAは既存レポートの40起動・38結果取得・2未取得に、公開資料の照合で過去3回を追加し、少なくとも43起動・41取得・2未取得。結果取得は合格回数を意味しません。Human Gate起点の修正10対応は完全解消数ではなく、実Cloudflare通信は下限170回です。各数値は単位が違うため合算しません。

基準日時点の最新コード監査はHigh 0・Medium 0・Low 3、範囲外持ち越し3件でコードQA合格。Issue #8後の実AI通信は0回、応答品質は再検証待ちです。公開記録では通常モデルはMistralのまま、Gemmaは正式採用しておらず、授業利用のHuman Gateも保留です。

## ファイル

- `report.md`：レポート原稿
- `press.md`：再利用用プレスリリース原稿（閲覧用は `press.html`）
- `evidence.md`、`evidence/`：公開用の集計、補正理由、根拠
- `assets/`：役割・工程図、SNS共有用画像・OGP画像、スタイル
- `scripts/build.mjs`：原稿と台帳から閲覧ページ・CSVを生成
- `scripts/check.mjs`：集計、内部リンク、公開ファイルの検査
- `UPDATE.md`：更新手順
- `VERIFICATION.md`：公開前後の確認記録

## ローカル確認・更新

Node.jsを使用し、外部パッケージは不要です。

```sh
node scripts/build.mjs
node scripts/check.mjs
node scripts/serve.mjs
```

ローカル表示は `http://127.0.0.1:4178/`。GitHub Pagesは `main` ブランチのルートを公開元にします。詳細は [UPDATE.md](UPDATE.md)。

このリポジトリは新しいGit履歴から開始した公開資料専用の構成です。元の開発リポジトリのコード・Git履歴・認証情報・個人情報・顧客情報・非公開原ログは含みません。資料の整理・サイト制作時に製品テストや実AI通信を再実行したとは主張しません。

発信・お問い合わせ：こむぎパソコン教室／[公式サイト](https://komugi-pc-school.tank.jp/)／info@komugi-pc-school.tank.jp

## メディア素材・技術サンプル

- `media.md` / `media.html`：SNS共有用画像、Issue #5比較画像、サンプルの用途と取得リンク
- `assets/media/dual-ai-qa-dx-square.png` / `.jpg` / `.svg`：通常のSNS画像投稿用、1080×1080
- `assets/ogp-dual-ai-qa-dx.png` / `.svg`：リンク共有用OGP画像、1200×630
- `media-src/dx-social.json` / `scripts/render-dx-social.ps1`：新しい共有画像の編集用データ・再生成コード
- `media-src/comparison.json` / `scripts/render-media.ps1`：既存のIssue #5比較画像の再生成
- `examples/blind-qa/` / `sample.html`：外部LLMを呼ばない架空データの最小QAデモ

再生成・公開確認は [UPDATE.md](UPDATE.md) を参照してください。SNSへの実投稿やSNS各社での表示確認は、このサイトの公開確認とは別です。
