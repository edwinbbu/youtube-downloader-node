#!/bin/bash
type=${1:-video}
echo $type;
shift

song=$@;
echo $song;

if [ $type == "audio" ];
    then
    echo "Downloading audio";
    x=$(node app -a $song)
    echo $x;
    else
    echo "Downloading video";
    node app -f 720 $song
fi


# ffmpeg -i input.m4a -acodec libmp3lame -ab 128k output.mp3
