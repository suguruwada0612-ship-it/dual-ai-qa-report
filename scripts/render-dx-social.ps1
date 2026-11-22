$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root
New-Item -ItemType Directory 'assets/media' -Force | Out-Null
function Render-Vector($width,$height,$elements,$stem) {
 $bmp = [Drawing.Bitmap]::new($width,$height)
 $g = [Drawing.Graphics]::FromImage($bmp)
 $g.SmoothingMode='AntiAlias';$g.TextRenderingHint='AntiAliasGridFit';$g.Clear([Drawing.Color]::White)
 $svg=[Collections.Generic.List[string]]::new()
 $svg.Add("<svg xmlns='http://www.w3.org/2000/svg' width='$width' height='$height' viewBox='0 0 $width $height'><rect width='$width' height='$height' fill='white'/>")
 foreach($e in $elements){
  $color=if($e.color){$e.color}else{'#102b46'}
  $brush=[Drawing.SolidBrush]::new([Drawing.ColorTranslator]::FromHtml($color))
  if($e.rect){$r=$e.rect;$g.FillRectangle($brush,$r[0],$r[1],$r[2],$r[3]);$svg.Add("<rect x='$($r[0])' y='$($r[1])' width='$($r[2])' height='$($r[3])' fill='$color'/>")}
  else{
   $style=if($e.bold){[Drawing.FontStyle]::Bold}else{[Drawing.FontStyle]::Regular}
   $font=[Drawing.Font]::new('Yu Gothic',$e.size,$style,[Drawing.GraphicsUnit]::Pixel)
   $measure=$g.MeasureString($e.text,$font)
   if($e.x+$measure.Width -gt $width-18){throw "Text exceeds safe width: $($e.text)"}
   $g.DrawString($e.text,$font,$brush,$e.x,$e.y)
   $safe=[Security.SecurityElement]::Escape($e.text);$weight=if($e.bold){700}else{400}
   $svg.Add("<text x='$($e.x+3)' y='$($e.y+$e.size)' font-family='Yu Gothic,Meiryo,sans-serif' font-size='$($e.size)' font-weight='$weight' fill='$color'>$safe</text>")
   $font.Dispose()
  }
  $brush.Dispose()
 }
 $svg.Add('</svg>')
 [IO.File]::WriteAllText((Join-Path $root "$stem.svg"),($svg -join "`n"),[Text.UTF8Encoding]::new($false))
 $bmp.Save((Join-Path $root "$stem.png"),[Drawing.Imaging.ImageFormat]::Png);$g.Dispose();$bmp.Dispose()
}
$data=Get-Content 'media-src/dx-social.json' -Raw -Encoding utf8 | ConvertFrom-Json
Render-Vector 1080 1080 $data.square 'assets/media/dual-ai-qa-dx-square'
Render-Vector 1200 630 $data.wide 'assets/ogp-dual-ai-qa-dx'
$img=[Drawing.Image]::FromFile((Join-Path $root 'assets/media/dual-ai-qa-dx-square.png'))
$codec=[Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$params=[Drawing.Imaging.EncoderParameters]::new(1)
$params.Param[0]=[Drawing.Imaging.EncoderParameter]::new([Drawing.Imaging.Encoder]::Quality,[long]95)
$img.Save((Join-Path $root 'assets/media/dual-ai-qa-dx-square.jpg'),$codec,$params)
$img.Dispose();$params.Dispose()

node scripts/tag-social-srgb.mjs
