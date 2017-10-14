'use strict';

var ts = require('tail-stream');

module.exports = {

    /**
     * The following method will tail a specific file
     * @param fileName - full path name to the file to tail
     * @param logQueue - A log queue implementation to queue messages
     * @param options - {
     *  - beginAt - default to end
     *  - onMove
     *  - endOnError: default false
     * }
     */
    tailFile: function ( fileName, logQueue, options){

        var tstream = ts.createReadStream( fileName, options);
        
        tstream.on('data', function(logMsg) {
            //console.log('Received Data', new Buffer(logMsg).toString());
            logQueue.push( new Buffer(logMsg).toString() );
        });


    }

};

