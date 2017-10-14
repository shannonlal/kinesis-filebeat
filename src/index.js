'use strict';

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

logMonitor.tail( LOG_FILE );


var cleanInterval = setInterval( function ( ){
    logMonitor.processLogs();
}, pushInterval);

  
