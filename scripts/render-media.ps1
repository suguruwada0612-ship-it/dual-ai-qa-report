param([string]$Ffmpeg = 'ffmpeg',[switch]$ImagesOnly)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root
New-Item -ItemType Directory 'assets/media','.preview/media-build' -Force | Out-Null
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
$comparison=Get-Content 'media-src/comparison.json' -Raw -Encoding utf8 | ConvertFrom-Json
Render-Vector $comparison.width $comparison.height $comparison.elements 'assets/media/issue5-comparison'
$movie=Get-Content 'media-src/scenes.json' -Raw -Encoding utf8 | ConvertFrom-Json
foreach($scene in $movie.scenes){
 $elements=@(
  @{text='DUAL-AI QA / '+$scene.label;x=62;y=40;size=27;color='#086260';bold=$true},
  @{rect=@(64,112,1152,3);color='#d7e2e8'}
 )+@($scene.lines)+@(
  @{text='実証記録に基づく再現｜記録基準：2026-11-22';x=64;y=620;size=23},
  @{text='岩手・北上｜こむぎパソコン教室';x=64;y=664;size=24;bold=$true},
  @{text=$scene.id+' / 06';x=1110;y=667;size=22;color='#086260'}
 )
 Render-Vector $movie.width $movie.height $elements "assets/media/scene-$($scene.id)"
}
if($ImagesOnly){exit 0}
$clips=[Collections.Generic.List[string]]::new()
foreach($scene in $movie.scenes){
 $frames=[int]($scene.duration*$movie.fps)
 $fadeOut=($scene.duration-0.35).ToString([Globalization.CultureInfo]::InvariantCulture)
 # A gentle 1.2% zoom and fades, expressed in elapsed seconds via frame/fps.
 $outFade = if($scene.id -eq $movie.scenes[-1].id){''}else{"fade=t=out:st=${fadeOut}:d=0.35:color=white,"}
 $filter="zoompan=z='1+0.012*on/($($movie.fps)*$($scene.duration))':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=${frames}:s=$($movie.width)x$($movie.height):fps=$($movie.fps),fade=t=in:st=0:d=0.35:color=white,${outFade}format=yuv420p"
 $out=".preview/media-build/$($scene.id).mp4"
 & $Ffmpeg -y -hide_banner -loglevel error -i "assets/media/scene-$($scene.id).png" -vf $filter -frames:v $frames -c:v libx264 -preset medium -crf 20 -an -movflags +faststart $out
 if($LASTEXITCODE -ne 0){throw "Encoding failed for $($scene.id)"}
 $clips.Add("file '$($scene.id).mp4'")
}
[IO.File]::WriteAllText((Join-Path $root '.preview/media-build/concat.txt'),($clips -join "`n"),[Text.UTF8Encoding]::new($false))
& $Ffmpeg -y -hide_banner -loglevel error -f concat -safe 0 -i '.preview/media-build/concat.txt' -c copy -movflags +faststart 'assets/media/dual-ai-qa-intro.mp4'
if($LASTEXITCODE -ne 0){throw 'Concat failed'}
Write-Output 'Rendered PNG/SVG and silent 52-second MP4.'
