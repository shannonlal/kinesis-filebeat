'use strict';

var Queue = require('queue-fifo');
var logger = require('winston');



module.exports = class LogQueue {
    /**
     * The following method will instantiate a log queue
     */
    constructor (){

        this.logQueue = new Queue();

        console.log( 'logQueue', this.logQueue);
    }

    /**
     * The following method will push a method onto the queue
     * 
     * @param {*} message 
     */
    push ( message ){
        this.logQueue.enqueue( message );
    }

    /**
     * The following method will return the message from the queue
     * @return message
     */
    pop( ){
        let self = this;
        let rest = this.logQueue.dequeue();
        console.log( 'pop', rest);
        return rest;
    }

    isEmpty(){
        return this.logQueue.isEmpty();
    }

};