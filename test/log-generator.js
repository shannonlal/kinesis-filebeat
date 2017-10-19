'use strict';

var fs = require('fs');
var wstream = fs.createWriteStream('./logs/test.log');
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


    for( var i=0; i < 2; i++){
        let l = {  
            SERIAL:"123456",
            EMAIL:"demo@microsigns.com",
            COMPANY:"MicroSigns-Shannon",
            PLATFORM:"Android",
            TYPE:"APP_LOG",
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