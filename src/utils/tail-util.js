var ts = require('tail-stream');

const LOG_FILE = process.env.LOG_FILE;

var tstream = ts.createReadStream(LOG_FILE, {
    beginAt: 'end',
    onMove: 'follow',
    endOnError: false
});

tstream.on('data', function(data) {
    console.log("got data: " + data);
});

tstream.on('eof', function() {
    console.log("reached end of file");
});

tstream.on('move', function(oldpath, newpath) {
    console.log("file moved from: " + oldpath + " to " + newpath);
});

tstream.on('truncate', function(newsize, oldsize) {
    console.log("file truncated from: " + oldsize + " to " + newsize);
});

tstream.on('end', function() {
    console.log("ended");
});

tstream.on('error', function(err) {
    console.log("error: " + err); 
});