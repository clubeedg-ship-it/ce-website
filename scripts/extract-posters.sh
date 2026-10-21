set -e
export PATH=~/.hermes/tools/ffmpeg-9.0.1-linux-x64/bin:$PATH
cd /home/otavio/apps/ce-website
P=site/src/assets/posters; mkdir -p $P
V=v2/assets/videos
CROP='crop=iw:ih-90:0:0'
ffmpeg -v error -y -ss 0.4 -i $V/cuttingedge-hero.webm -frames:v 1 -vf "$CROP" -q:v 3 -strict unofficial $P/hero.jpg
ffmpeg -v error -y -ss 6 -i $V/video-002.webm -frames:v 1 -q:v 3 -strict unofficial $P/salon.jpg
ffmpeg -v error -y -ss 3 -i $V/video-001.webm -frames:v 1 -vf "$CROP" -q:v 3 -strict unofficial $P/jewellery.jpg
ffmpeg -v error -y -ss 2 -i $V/video-003.webm -frames:v 1 -vf "$CROP" -q:v 3 -strict unofficial $P/restaurant.jpg
ffmpeg -v error -y -ss 0 -i $V/video-004.webm -frames:v 1 -q:v 3 -strict unofficial $P/process-model.jpg
ls -la $P
