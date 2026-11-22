Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap 1200,630
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = 'AntiAlias'
$g.TextRenderingHint = 'AntiAliasGridFit'
$navy = [System.Drawing.ColorTranslator]::FromHtml('#102b46')
$teal = [System.Drawing.ColorTranslator]::FromHtml('#086260')
$g.Clear([System.Drawing.Color]::White)
$svg = [System.Collections.Generic.List[string]]::new()
$svg.Add('<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="white"/>')
function Label($text,$x,$y,$size,$color,$bold) {
 $style = if($bold){[System.Drawing.FontStyle]::Bold}else{[System.Drawing.FontStyle]::Regular}
 $font = [System.Drawing.Font]::new('Yu Gothic',$size,$style,[System.Drawing.GraphicsUnit]::Pixel)
 $brush = [System.Drawing.SolidBrush]::new($color)
 $g.DrawString($text,$font,$brush,$x,$y)
 $hex = '#'+$color.R.ToString('X2')+$color.G.ToString('X2')+$color.B.ToString('X2')
 $weight = if($bold){700}else{400}
 $safe = [System.Security.SecurityElement]::Escape($text)
 $svg.Add("<text x='$($x+3)' y='$($y+$size)' font-family='Yu Gothic,Meiryo,sans-serif' font-size='$size' font-weight='$weight' fill='$hex'>$safe</text>")
 $font.Dispose(); $brush.Dispose()
}
Label 'Dual-AI QA 技術実証レポート' 52 35 28 $teal $true
Label 'テストはPASS。' 48 100 76 $navy $true
Label '講師の判定は、' 48 195 76 $navy $true
Label '不合格だった。' 48 290 76 $navy $true
Label 'Human Gate × Codex × Claude Code' 52 410 30 $teal $true
Label '岩手・北上｜こむぎパソコン教室' 52 545 30 $navy $true
$labels = @('Human Gate','Codex','Claude Code','再修正','Human Gate')
$subs = @('講師が要件を定義','開発・テスト','独立QA','指摘を反映','実機で判断・差し戻し')
for($i=0;$i -lt 5;$i++) {
 $y=52+$i*102
 $brush=[System.Drawing.SolidBrush]::new($navy)
 $g.FillRectangle($brush,825,$y,325,80); $brush.Dispose()
 $svg.Add("<rect x='825' y='$y' width='325' height='80' rx='5' fill='#102b46'/>")
 Label $labels[$i] 842 ($y+4) 28 ([System.Drawing.Color]::White) $true
 Label $subs[$i] 842 ($y+43) 19 ([System.Drawing.Color]::White) $false
 if($i -lt 4){Label '↓' 970 ($y+77) 24 $teal $true}
}
$svg.Add('</svg>')
[System.IO.File]::WriteAllText((Join-Path (Get-Location) 'assets/ogp-dual-ai-qa.svg'),($svg -join "`n"),[System.Text.UTF8Encoding]::new($false))
$bmp.Save((Join-Path (Get-Location) 'assets/ogp-dual-ai-qa.png'),[System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose();$bmp.Dispose()
