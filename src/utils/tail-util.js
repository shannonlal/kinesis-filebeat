var ts = require('tail-stream');


var args = process.argv.slice(2);
let logFile;
if( typeof args !=='undefined' && args.length > 0){
    logFile = args[0];
}else{
    logFile = process.env.LOG_STREAM_FILE;
}

console.log( 'Tailing file', logFile );
var tstream = ts.createReadStream(logFile, {
    beginAt: 'end',
    onMove: 'stay',
    endOnError: false,
    onTruncate:'reset',
    waitForCreate: true
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