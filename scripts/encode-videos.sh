#!/usr/bin/env bash
# Re-encode source videos into site/public/media (WebM VP9 + MP4 H.264). Run from repo root.
# Source videos are 'Veo' AI renders: the watermark strip is cropped off the bottom.
set -u
FF=~/.hermes/tools/ffmpeg-9.0.1-linux-x64/bin/ffmpeg
SRC=v2/assets/videos
OUT=site/public/media
mkdir -p "$OUT"

# enc <src> <name> <vfilter> <vp9 kbps> <x264 kbps>
enc() {
  local src=$1 name=$2 vf=$3 vb=$4 hb=$5
  [ -f "$OUT/$name.webm" ] || $FF -v error -y -i "$src" -an -vf "$vf" -c:v libvpx-vp9 -b:v ${vb}k -crf 34 -maxrate $((vb*14/10))k \
      -deadline good -cpu-used 4 -row-mt 1 -g 120 -pix_fmt yuv420p "$OUT/$name.webm"
  [ -f "$OUT/$name.mp4" ] || $FF -v error -y -i "$src" -an -vf "$vf" -c:v libx264 -preset slow -b:v ${hb}k -maxrate $((hb*14/10))k -bufsize $((hb*3))k \
      -pix_fmt yuv420p -profile:v high -movflags +faststart "$OUT/$name.mp4"
  echo done $name $(du -k "$OUT/$name.webm" "$OUT/$name.mp4" | cut -f1 | tr '\n' ' ')
}
CROP='crop=iw:ih-90:0:0'
enc $SRC/cuttingedge-hero.webm hero-1080 "$CROP,scale=1920:-2,fps=24" 780 820
enc $SRC/cuttingedge-hero.webm hero-720  "$CROP,scale=960:-2,fps=24"  330 380
enc $SRC/video-001.webm project-jewellery "$CROP,scale=1280:-2,fps=24" 1050 1050
enc $SRC/video-003.webm project-restaurant "$CROP,scale=1280:-2,fps=24" 1500 1500
enc $SRC/video-002.webm project-salon "scale=1280:-2,fps=24" 850 850
enc $SRC/video-004.webm process-model "scale=960:-2,fps=24" 1500 1500
echo ALLDONE
