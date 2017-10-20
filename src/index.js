'use strict';

//Get the environment variables
const LogMonitor = require ('./LogMonitor');

var args = process.argv.slice(2);
let logFile;
console.log( 'arguments', args);
if( typeof args !=='undefined' && args.length > 3){
    process.env.LOG_FILE= args[0];
    process.env.PUSH_INTERVAL= args[1];
    process.env.AWS_ACCESS_KEY = args[2];
    process.env.AWS_SECRET_KEY = args[3];
    process.env.AWS_KINESIS_STREAM_NAME = args[4];
}
const LOG_FILE = process.env.LOG_FILE;
let pushInterval = process.env.PUSH_INTERVAL;

if( typeof pushInterval === 'undefined'){
    //Default to 30 seconds
    pushInterval = 30000;
}

const logMonitor = new LogMonitor( {pushInterval:pushInterval} );

console.log('Tailing the following file ->', LOG_FILE);

logMonitor.tail( LOG_FILE );


var cleanInterval = setInterval( function ( ){
    logMonitor.processLogs().then( rst =>{
        console.log('Messages sent ')
    }).catch( err=>{    
        console.log('Error processing', err);
    });
}, pushInterval);

  
