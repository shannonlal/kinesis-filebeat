'use strict';

var Queue = require('queue-fifo');
var logger = require('winston');



module.exports = class LogQueue {
    /**
     * The following method will instantiate a log queue
     */
    constructor (){
        this.logQueue = new Queue();
    }

    /**
     * The following method will push a method onto the queue
     * 
     * @param {*} message 
     */
    push ( message ){
        console.log('Putting message on queue');
        this.logQueue.enqueue( message );
    }

    /**
     * The following method will return the message from the queue
     * @return message
     */
    pop ( ){
        let self = this;
        let rest = this.logQueue.dequeue();
        return rest;
    }

    /**
     * The following method will return whether the queue is empty
     * @return {boolean}
     */
    isEmpty (){
        return this.logQueue.isEmpty();
    }

    /**
     * The following method will return the size of the queue
     * @return {int}
     */
    size (){
        return this.logQueue.size();
    }
};