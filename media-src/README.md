# 比較画像の再生成

Windows PowerShell 5.1、System.Drawing、Yu Gothicを使用します。設定は comparison.json、出力は assets/media/issue5-comparison.png と同名SVGです。

```powershell
powershell -NoProfile -File scripts/render-media.ps1
```

1200×630。実証記録に基づく再現。記録基準2026-11-22。[閲覧ページ](../media.html)

## DX・AX訴求のSNS共用画像・OGP画像

編集用データ：`dx-social.json`。Windows PowerShell 5.1、System.Drawing、Yu Gothic、Node.jsとWindows標準のsRGB ICCプロファイルを使用します。追加パッケージ・外部APIは不要です。

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/render-dx-social.ps1
```

リポジトリ直下から実行すると、1080×1080の正方形PNG・JPEG（品質95）・編集用SVGと、1200×630の横長PNG・SVGを再生成します。PNGはsRGBチャンク、JPEGは標準sRGB ICCを付与し、白背景で不透明です。SVGとPNGは同じ配置データから生成します。SVGを単独編集した場合は、SVG対応ブラウザーや画像編集ソフトから指定寸法で再出力し、PNGとJPEGを開いて確認してください。標準の再生成ではJSON側にも変更を反映してください。

出力先は `assets/media/dual-ai-qa-dx-square.*` と `assets/ogp-dual-ai-qa-dx.*`。前者はX・Threads・Instagramの通常投稿用、後者はサイトURLの共有カード用です。各SNSの表示・キャッシュ更新は別途確認が必要です。
