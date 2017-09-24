'use strict';

var tailFile = require ('./monitor/tail-file');

var options = {
    beginAt: 'end',
    onMove: 'follow',
    endOnError: false
};

tailFile.tailFile( './test.txt', options);