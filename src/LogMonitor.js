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
                onMove: 'stay',
                endOnError: false,
                onTruncate:'reset',
                waitForCreate: true
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
        let tstream;
        try{
            tstream = ts.createReadStream( fileName, self.options);
        }catch( err){
            console.log('Error openning file');
        }
        tstream.on('data', function (logMsg) {
            console.log( 'Reading data');
            let msg = new Buffer(logMsg).toString();            
            let listOfMessages = msg.split('\n');

            listOfMessages.map( logEntry =>{

                if( typeof logEntry !== 'undefined' && logEntry !== ''){
                    console.log(`logEntry -> on queue ${logEntry}`);
                    self.logQueue.push(  logEntry );
                    
                    console.log('Adding to Queue', (self.logQueue.size()));
                }
            });

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
    }

    /**
     * The following process the logs when ever the function is called
     * It will 
     * @param fileName - full path name to the file to tail
     */
    processLogs (){

        return new Promise ((resolve,reject)=>{
            console.log( 'Processing the logs');
            let self = this;
            let messages = [];
            //Set timer to only go 80% of the push interval
            var endTimer = Date.now() + parseInt( self.pushInterval * 0.8);
        
           if( self.logQueue.isEmpty()){
                console.log('Queue is empty');
            }
            
            while( Date.now() < endTimer && !self.logQueue.isEmpty()){
                let msg = self.logQueue.pop();

                //msg = msg.substring( 0, msg.indexOf("\n"));
               // console.log( 'Message',msg );

                if( typeof msg !== 'undefined' && msg !== ''){
                    messages.push(  msg );
                }else{
                    console.log('Empty String on queue');
                }

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

