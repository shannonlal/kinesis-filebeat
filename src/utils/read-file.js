'use strict';

const fs = require('fs');
var args =  process.argv.slice(2);

var fileName;
console.log( 'arguments', args);
if( typeof args !=='undefined' && args.length > 0){
    console.log( 'Getting file name');
    fileName= args[0];

}

console.log( 'Filename', fileName);

fs.readFile(fileName, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    console.log(data);
});

