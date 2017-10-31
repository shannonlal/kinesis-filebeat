'use strict';

var ts = require('tail-stream');
var Tail = require( 'tail').Tail;
const LogQueue = require( './LogQueue');
const KinesisLogProcess= require( './KinesisLogProcess');
const fileTailer = require('file-tail');

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
            console.log( 'Overridding options');
            this.options =  {
                beginAt: 'end',
                onMove: 'stay',
                endOnError: false,
                detectTruncate: true,
                onTruncate:'reset',
                waitForCreate: true,
                useWatch: true
            };
        }else{
            this.options = tailOptions;
        }

        this.sizeOfFile=  0;
        this.linesCurrentlyRead = 0;
        this.lineIndex = 0;

        this.fileClosed = true;
    }
    
    /**
     * The following method will tail a specific file
     * @param fileName - full path name to the file to tail
     */
    tail ( fileName ){
        let self = this;
        let tstream;
        
        tstream = ts.createReadStream( fileName, self.options);
        
        //console.log( 'Stream', tstream);
        self.fileClosed = false;
        tstream.on('data', function (logMsg) {
            console.log( 'Reading data');
            let msg = new Buffer(logMsg).toString();            
            let listOfMessages = msg.split('\n');

            listOfMessages.map( logEntry =>{

                if( typeof logEntry !== 'undefined' && logEntry !== ''){
                    self.logQueue.push(  logEntry );
                    
                }
            });

        });

        tstream.on('eof', function() {
            //console.log("reached end of file");
            self.fileClosed = true;
        });
        

        
        tstream.on('move', function(oldpath, newpath) {
            //console.log("file moved from: " + oldpath + " to " + newpath);
        });
        
        tstream.on('truncate', function(newsize, oldsize) {
            //console.log("file truncated from: " + oldsize + " to " + newsize);
        });
        
        tstream.on('end', function() {
            console.log("ended");
            //self.fileClosed = true;
        });
        
        tstream.on('error', function(err) {
            console.log("error: " + err); 
            //self.fileClosed = true;
        });
    }

    tailFile ( fileName ){
        let self = this;
        let tstream;

        let options = {
            fd: fileName,           // Required 
            ms: 1000,     // Defaults to 100 (milliseconds) 
            mode: 'stream',                  // The other option is 'stream' 
            encoding: 'utf8',               // see Node's fs.createReadStream 
            onErr: function(error){
                console.log('Error', error)
            }      // immediately listen for 'error' event 
        }



        let ft = fileTailer.startTailing(options);
        ft.on('stream', function(stream){
            let rst = '';
            stream.on('data',(chunk)=>{
                rst += chunk;
            });

            stream.on('end', ()=>{
                console.log( 'Final ->', rst);

                let lines = rst.split('\n');

                console.log( 'Split lines into ->', lines);

                if( ( typeof lines !== 'undefined') && (lines.length > 0) ){
                    for( let i=0; i< lines.length; i++){
                        if( ( typeof lines[i] !== 'undefined') && (lines[i] !== '') ){
                            self.logQueue.push(  lines[i] );
                        }
                    }
                }
            });


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
                console.log('Queue is empty. Stopping till next interval');
                resolve('No logs available');
                return;
            }
            
            while( (Date.now() < endTimer) && (!self.logQueue.isEmpty())) {
                let msg = self.logQueue.pop();

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
                    console.log( 'Sent logs to kinesis. Stopping to next interval');
                    resolve( rst );
                    return;
                }).catch( err =>{
                    console.log( 'Error sending logs ', err);
                    reject( err );
                });
            }else{
                console.log('No logs to send.  Stopping till next interval');
                resolve('No logs available');
                return;
            }
        });

    }
};

