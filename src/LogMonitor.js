'use strict';

var ts = require('tail-stream');
const LogQueue = require( './LogQueue');

module.exports = class LogMonitor{

    /**
     * The following method will instantiate the File Monitor
     * @param monitorOptions
     * @param monitorOptions.pushInterval - interval for pushing logs
     * @param monitorOptions.tailOptions - {optional} - 
     */
    constructor ( monitorOptions ){
        this.logQueue = new LogQueue();;
        this.pushInterval = monitorOptions.pushInterval;
        if( typeof monitorOptions.tailOptions === 'undefined'){
            this.options =  {
                beginAt: 'end',
                onMove: 'follow',
                endOnError: false
            };
        }else{
            this.options = tailOptions;
        }
    }

    /**
     * The following method will tail a specific file
     * @param fileName - full path name to the file to tail
     */
    tail( fileName ){
        let self = this;
        //TODO.  Put in logic to handle stream not there to retry after fixed interval
        var tstream = ts.createReadStream( fileName, self.options);
        
        tstream.on('data', function(logMsg) {
            self.logQueue.push( new Buffer(logMsg).toString() );
        });
    }

    /**
     * The following process the logs when ever the function is called
     * It will 
     * @param fileName - full path name to the file to tail
     */
    processLogs( ){
        let self = this;
        //Set timer to only go 80% of the push interval
        var endTimer = Date.now() + parseInt( self.pushInterval * 0.8);
    
        if( self.logQueue.isEmpty()){
            console.log('Queue is empty');
        }
        while( Date.now() < endTimer && !self.logQueue.isEmpty()){
            console.log( 'Message', self.logQueue.pop());
        }
    
        //console.log('Completed Processing logs');
    }
};

