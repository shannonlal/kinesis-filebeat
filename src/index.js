'use strict';

var args = process.argv.slice(2);

console.log( 'arguments', args);
if( typeof args !=='undefined' && args.length > 3){
    console.log( 'Over writing env properties from cmd');
    process.env.LOG_FILE= args[0];
    process.env.PUSH_INTERVAL= args[1];
    process.env.AWS_ACCESS_KEY = args[2];
    process.env.AWS_SECRET_KEY = args[3];
    process.env.AWS_KINESIS_STREAM_NAME = args[4];
    process.env.REGION = args[5];
}

//Get the environment variables
const LogMonitor = require ('./LogMonitor');


const LOG_FILE = process.env.LOG_FILE;
let pushInterval = process.env.PUSH_INTERVAL;

if( typeof pushInterval === 'undefined'){
    //Default to 30 seconds
    pushInterval = 30000;
}

const logMonitor = new LogMonitor( {pushInterval:pushInterval} );

console.log('Tailing the following file ->', LOG_FILE);

//logMonitor.tail( LOG_FILE );
logMonitor.tail( LOG_FILE );

var cleanInterval = setInterval( function ( ){

    if( logMonitor.fileClosed){
        //Reopen file
        logMonitor.tail( LOG_FILE );
    }
    logMonitor.processLogs().then( rst =>{
        console.log('Messages sent ')
    }).catch( err=>{    
        console.log('Error processing', err);
    });
}, pushInterval);

  
