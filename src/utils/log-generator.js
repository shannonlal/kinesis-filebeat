'use strict';

var args = process.argv.slice(2);
let logFile;
if( typeof args !=='undefined' && args.length > 0){
    logFile = args[0];
}else{
    logFile = process.env.LOG_STREAM_FILE;
}


var fs = require('fs');
console.log( 'Writing to the following', logFile);
var wstream = fs.createWriteStream(logFile);
var interval;

function writeToFile ( msg ){
    wstream.write( msg );
    wstream.write( '\n' );
}

function exitHandler (options, err) {
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

interval = setInterval(function ( ) {
    let msg = 'Test Message ->';


    for( var i=0; i < 10; i++){
        let l = {  
            TIMESTAMP: new Date().toISOString(),
            SERIAL:"123456",
            EMAIL:"demo@microsigns.com",
            COMPANY:"MicroSigns-Shannon",
            PLATFORM:"Android",
            TYPE:"CMS_LOG",
            SUB_TYPE:"INFO",
            TRIGGER:"USER_ACTION",
            LOG:{  
               LOG_MESSAGE:`#99 Submitting log number : ${i}`
            }
         };
        //msg += ` -> Test Message with lots of data that keeps going and going ${i}`;
         msg = JSON.stringify( l );
        writeToFile( msg );
    }
    //msg += Date.now();
  }, 4000);