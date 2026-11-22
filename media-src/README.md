# メディア素材の台本・絵コンテ・再制作手順

制作日：2026-11-23。実証記録の基準日：2026-11-22、参照コミット `47d8208`。
発信：岩手・北上｜こむぎパソコン教室。

## 企画と構成

比較画像は1200×630 PNGと編集可能なSVG。講師の依頼と当時のAIの応答を左右に置き、Human Gateの不合格判断と後続工程を示します。動画は横長1280×720、24fps、52秒、音声なし。日本語テロップを焼き込み、緩やかな1.2%のズームと0.35秒のフェードを使用します。時間はJSONの秒数とfpsから計算します。

すべて実証記録に基づく再現で、実アプリ画面や操作録画ではありません。出典は[公開Issue経緯](../evidence/human-gate-chronology.md)。私的な生ログや製品コードは使いません。

| 時間 | テロップ・要点 | 絵コンテ |
|---|---|---|
| 0–8秒 | テストはPASS。講師の判定は、不合格だった。 | [01 PNG](../assets/media/scene-01.png)・[SVG](../assets/media/scene-01.svg) |
| 8–17秒 | 講師「120文字で提案してください。」／当時のAI「文章の長さは120文字程度にしますか？」 | [02 PNG](../assets/media/scene-02.png)・[SVG](../assets/media/scene-02.svg) |
| 17–25秒 | 初心者が自分の指示を疑わないために、教育品質として不合格。 | [03 PNG](../assets/media/scene-03.png)・[SVG](../assets/media/scene-03.svg) |
| 25–34秒 | 講師：要件と実機判断／Codex：開発・修正／Claude Code：独立QA・再監査 | [04 PNG](../assets/media/scene-04.png)・[SVG](../assets/media/scene-04.svg) |
| 34–44秒 | 会話履歴修正→Mistral評価→Gemma比較→独立ブラインドQA→Issue #8修正 | [05 PNG](../assets/media/scene-05.png)・[SVG](../assets/media/scene-05.svg) |
| 44–52秒 | コード合格と実応答品質は別。Mistral継続・Gemma未採用・実品質再検証待ち。 | [06 PNG](../assets/media/scene-06.png)・[SVG](../assets/media/scene-06.svg) |

各場面の全文・座標・文字サイズは [scenes.json](scenes.json)、比較画像は [comparison.json](comparison.json) に保存しています。SVG単独でも編集できますが、同じ変更をJSONへ戻すとPNGと動画を再生成できます。

## 必要なもの

- Windows PowerShell 5.1、.NETのSystem.Drawing、Yu Gothicフォント（Windows標準環境を使用）。フォント自体は再配布しません。
- FFmpeg 7.1相当、libx264エンコーダ。ffmpeg実行ファイルのパスを指定してください。
- Webページ生成にはNode.js。外部API・AIモデル・有料サービスは不要です。

環境確認時にFFmpegの実行ファイルが見つからなかったため、[PyPIのimageio-ffmpeg 0.6.0](https://pypi.org/project/imageio-ffmpeg/0.6.0/) Windows wheel内のFFmpeg 7.1を作業専用フォルダに展開しました。SHA256は `02fa47c83703c37df6bfe4896aab339013f62bf02c5ebf2dce6da56af04ffc0a`。実行バイナリや配布wheelは公開リポジトリに含めていません。[FFmpeg公式フィルター資料](https://ffmpeg.org/ffmpeg-filters.html)を参照してズーム・フェード・連結を設定しています。

## 再制作

リポジトリルートで次を実行します。ffmpegがPATHにあれば指定は不要です。自動ダウンロードはしません。

```powershell
powershell -NoProfile -File scripts/render-media.ps1 -ImagesOnly
powershell -NoProfile -File scripts/render-media.ps1 -Ffmpeg ffmpeg
node scripts/build.mjs
node scripts/check.mjs
```

MP4とPNG/SVGは `assets/media/` へ、途中の動画はGit管理外の `.preview/media-build/` へ出力します。ファイルを再生成するため同名素材は上書きされます。`intro-ja.vtt` は任意表示用の字幕です。映像内テロップと併せて更新してください。

台本と画面は再現できますが、OS・フォント・FFmpegの版差によるピクセルやエンコードの完全一致は保証しません。元アプリの操作、実LLMの応答、第三者認証、教育効果は再現・実証していません。

[閲覧ページ](../media.html) ／ [MP4](../assets/media/dual-ai-qa-intro.mp4)
