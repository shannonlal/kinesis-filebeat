'use strict';

var ts = require('tail-stream');
const LogQueue = require( './LogQueue');
const KinesisLogProcess= require( './KinesisLogProcess');

module.exports = class LogMonitor{

    /**
     * The following method will instantiate the File Monitor
     * @param monitorOptions
     * @param monitorOptions.pushInterval - interval for pushing logs
     * @param monitorOptions.tailOptions - {optional} - 
     */
    constructor ( monitorOptions ){
        this.logQueue = new LogQueue();
        this.kinesisLog = new KinesisLogProcess();
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
    tail ( fileName ){
        let self = this;
        //TODO.  Put in logic to handle stream not there to retry after fixed interval
        var tstream = ts.createReadStream( fileName, self.options);
        
        tstream.on('data', function (logMsg) {
            let msg = new Buffer(logMsg).toString();
            //console.log( msg );
            self.logQueue.push(  msg );
        });
    }

    /**
     * The following process the logs when ever the function is called
     * It will 
     * @param fileName - full path name to the file to tail
     */
    processLogs (){

        return new Promise ((resolve,reject)=>{
            let self = this;
            let messages = [];
            //Set timer to only go 80% of the push interval
            var endTimer = Date.now() + parseInt( self.pushInterval * 0.8);
        
           if( self.logQueue.isEmpty()){
                console.log('Queue is empty');
            }
            
            while( Date.now() < endTimer && !self.logQueue.isEmpty()){
                let msg = self.logQueue.pop();

                msg = msg.substring( 0, msg.indexOf("\n"));
                //console.log( 'Message',msg );


                messages.push(  msg );
            }
    
           if( messages.length > 0){
               console.log( 'Sending messages ->', messages.length );
               console.log( 'Left on queue ->', self.logQueue.size() );
                return self.kinesisLog.sendLogsToStream( messages ).then( rst =>{
                    console.log( 'Sent logs to kinesis',rst);
                    resolve( rst );
                }).catch( err =>{
                    console.log( 'Error sending logs ', err);
                    reject( err );
                });
            }else{
                resolve('No logs available');
            }
        });

    }
};

