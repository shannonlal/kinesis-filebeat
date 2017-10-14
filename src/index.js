'use strict';

var tailFile = require ('./monitor/tail-file');
const LogQueue = require( './monitor/log-queue');

var logQueue = new LogQueue();

var options = {
    beginAt: 'end',
    onMove: 'follow',
    endOnError: false
};

const LOG_FILE = process.env.LOG_FILE;
let pushInterval = process.env.PUSH_INTERVAL;

if( typeof pushInterval === 'undefined'){
    //Default to 30 seconds
    pushInterval = 30000;
}

console.log('Tailing the following file ->', LOG_FILE);
tailFile.tailFile( LOG_FILE, logQueue, options);

//TODO Test this tomorrow and integrate
var processLogs = function (){
    //TODO Replace this tomorrow
    //Set timer to only go 80% of the push interval
    var endTimer = Date.now() + parseInt( pushInterval * 0.8);

    if( logQueue.isEmpty()){
        console.log('Queue is empty');
    }
    while( Date.now() < endTimer && !logQueue.isEmpty()){
        console.log( 'Message', logQueue.pop());
    }

    console.log('Completed Processing logs');
};

var cleanInterval = setInterval( function ( ){
    processLogs();
}, pushInterval);

  
