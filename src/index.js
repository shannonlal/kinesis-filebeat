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
    var startTimer = new Date();

    while( starTime > 5000 && !logQueue.isEmpty()){
        console.log( 'Message', logQueue.pop());
    }
}

var interval = setInterval(function() {
    console.log(str1 + " " + str2);
  }, 10000, "Hello.", "How are you?");
  
