'use strict';

var fs = require('fs');
var wstream = fs.createWriteStream('./logs/test.log');
var interval;

function writeToFile( msg ){
    wstream.write( msg );
    wstream.write( '\n' );
}

function exitHandler(options, err) {
    console.log('Shutting down program');

    if( typeof interval !== 'undefined' ){
        clearInterval(  interval );
    }
    wstream.end();
}


//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

interval = setInterval(function( ) {
    let msg = 'Test Message ->'

    for( var i=0; i < 100; i++){
        msg += ' -> Test Message with lots of data that keeps going and going '+i;
    }
    msg += Date.now();
    writeToFile( msg );
  }, 1000);