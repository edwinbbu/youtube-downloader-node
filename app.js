var fs= require('fs');
var request= require('request');
var cheerio = require('cheerio');
var path = require('path');
var youtubedl = require('youtube-dl');

var search = "https://www.youtube.com/results?search_query=keerthichakra+songs";
var url = "https://www.youtube.com/watch?v=1RWB7mFZQJU";

request(search, function (err, response, body) {
    if(err)
    {
        console.log(err);
    }
    //console.log(body)
    var $ = cheerio.load(body);
    var title=[];
    //console.log($('a#video-title.yt-simple-endpoint.style-scope.ytd-video-renderer'));
    $('h3.yt-lockup-title').each(function (i, elem) {
        title[i] = $(this).text();
        //console.log(elem);
    });
    //console.log(title);
});

var video = youtubedl(url,
    // Optional arguments passed to youtube-dl.
    ['--format=18'],
    // Additional options can be given for calling `child_process.execFile()`.
    { cwd: __dirname });

// Will be called when the download starts.
var size = 0;
video.on('info', function (info) {
    'use strict';
    size = info.size;

    console.log('Got video info');
    var file = path.join(__dirname, info._filename);
    video.pipe(fs.createWriteStream(file));

});

var pos = 0;
video.on('data', function data(chunk) {
    'use strict';
    pos += chunk.length;

    if (size) {
        var percent = (pos / size * 100).toFixed(2);
        process.stdout.cursorTo(0);
        process.stdout.clearLine(1);
        process.stdout.write(percent + '%');
    }
});

video.on('end', function end() {
    console.log('\nDone');
});