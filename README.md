# Dual-AI QA 技術実証レポート

こむぎパソコン教室（岩手県北上市）の講師が、AIで開発したKOMUGI Classroom DXを実機で試し、自動テストがPASSした後にも残った問題を教育品質として不合格と判断。その指摘が設計変更、修正、Mistral・Gemma比較、独立ブラインドQAへつながった実証記録です。

**現場専門家による要件定義・Human Gate × Codexによる開発 × Claude Codeによる独立QA**を中心に、成果と残課題を公開します。[Issue #1〜#8の公開用経緯](evidence/human-gate-chronology.md)では、一次資料を直接照合し、依頼と実施結果を分けています。

- [技術実証レポート](https://suguruwada0612-ship-it.github.io/dual-ai-qa-report/)
- [報道向けプレスリリース](https://suguruwada0612-ship-it.github.io/dual-ai-qa-report/press.html)
- [集計台帳・公開監査抜粋](https://suguruwada0612-ship-it.github.io/dual-ai-qa-report/evidence.html)

## 集計基準

2026年11月22日 JST。開発資料の参照コミットは `47d820885f6f5fd28a225fbf8829a231550d2044`。

主要自動テスト37回分・延べ2,970件、最新200ケース。独立QAは既存レポートの40起動・38結果取得・2未取得に、今回の資料照合で過去3回を追加し、少なくとも43起動・41取得・2未取得。Human Gate起点の修正10対応、実Cloudflare通信は下限170回です。各数値は単位が違うため合算しません。

最新のコード監査はHigh 0・Medium 0・Low 3、範囲外持ち越し3件でコードQA合格。修正後の実AI通信は0回、応答品質は再検証待ちです。通常モデルはMistralのまま、Gemmaは正式採用しておらず、授業利用のHuman Gateも保留です。

## ファイル

- `report.md`：レポート原稿
- `press.md`：再利用用プレスリリース原稿（閲覧用は `press.html`）
- `evidence.md`、`evidence/`：公開用の集計、補正理由、根拠
- `assets/`：役割・工程図とスタイル
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

## 追加のメディア素材・技術サンプル

[画像・52秒動画・QAサンプルの閲覧ページ](https://suguruwada0612-ship-it.github.io/dual-ai-qa-report/media.html)を追加しました。制作日は2026年11月23日、紹介する実証記録の基準日は11月22日のままです。比較画像は実証記録に基づく再現、QAサンプルは完全架空データによるAPI接続なしのデモです。

- `media.md` / `media.html`：素材一覧と説明
- `assets/media/`：比較PNG/SVG、紹介MP4、字幕、絵コンテ
- `media-src/` / `scripts/render-media.ps1`：台本・編集用データ・再制作コード
- `examples/blind-qa/` / `sample.html`：最小QAサンプルと実行方法
