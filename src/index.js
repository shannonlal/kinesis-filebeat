'use strict';

var tailFile = require ('./monitor/tail-file');
const LogQueue = require( './monitor/log-queue');

var logQueue = new LogQueue();

var options = {
    beginAt: 'end',
    onMove: 'follow',
    endOnError: false
};

tailFile.tailFile( './test.txt', logQueue, options);

//TODO Test this tomorrow and integrate
var processLogs = function(){
    //TODO Replace this tomorrow
    var endTimer = Date.now() + 5000;

    if( logQueue.isEmpty()){
        console.log('Queue is empty');
    }
    while( Date.now() < endTimer && !logQueue.isEmpty()){
        console.log( 'Message', logQueue.pop());
    }

    console.log('Completed Processing logs');
}

var messageInterval = setInterval(function( ) {
    let msg = 'Test Message ->'+ Date.now();
    console.log('Putting message on queue');
    logQueue.push( msg );
  }, 1000);

  var cleanInterval = setInterval(function( ) {
    processLogs();
  }, 5000);

  
