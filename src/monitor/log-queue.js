'use strict';

var queue = require('queue');
var log = require('winston');

var LogQueue = function (){

    pop: function(){

    }
};
module.exports = class LogQueue {
    /**
     * The following method will instantiate a log queue
     */
    constructor (){
        this.results = [];
        var opts = {
            autostart:true
        };
        this.logQueue = queue ( opts );
        this.logQueue.results = this.results;
    }

    /**
     * The following method will push a method onto the queue
     * 
     * @param {*} message 
     */
    push ( message ){
        let self = this;
        queue.push( () => {
            return new Promise ( (resolve, reject) => {
                self.results.push( message );
                logger.log('debug', 'msg added to queue ->'+message );
                resolve();
            } );

        });
    }

    /**
     * The following method will return the message from the queue
     */
    pop( ){
        let self = this;
        queue.pop( ()=>{
            return new Promise( (resolve, reject) => {
                let message = self.results.pop();
                logger.log('debug', 'msg removed from queue ->'+message );
                resolve( message );
            });
        });
    }

};