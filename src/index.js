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

