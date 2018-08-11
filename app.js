var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var path = require('path');
var youtubedl = require('youtube-dl');

var myArgs = process.argv.slice(2);
var search = '';
for (var i = 0; i < myArgs.length; i++) {
    search = search + myArgs[i] + ' ';
}
//console.log(search);
var query = "https://www.youtube.com/results?search_query=" + search;

var list = [];
request(query, function (err, response, body) {
    if (err) {
        console.log(err);
    }
    //console.log(body)
    var $ = cheerio.load(body);
    $('h3.yt-lockup-title').each(function (i, elem) {
        var a = $(this).find('a').attr('href');
        list.push(a);
    });
    var url = "https://www.youtube.com" + list[0];
    download(url);
});


function download(url) {
    var video = youtubedl(url,
        // Optional arguments passed to youtube-dl.
        ['--format=22'],
        // Additional options can be given for calling `child_process.execFile()`.
        { cwd: __dirname + "/output" });

    // Will be called when the download starts.
    var size = 0;
    video.on('info', function (info) {
        'use strict';
        size = parseInt(info.size);
        var displaysize = size / (1024 * 1024);
        displaysize=displaysize.toFixed(2);
        console.log("Video: " + info._filename);
        console.log("Size: " + displaysize + " MB");
        var file = path.join(__dirname + "/output", info._filename);
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
};
