'use strict';

var AWS = require('aws-sdk');

var accessKey = process.env.AWS_ACCESS_KEY;
var secretKey = process.env.AWS_SECRET_KEY;
var DeliveryStreamName = process.env.AWS_KINESIS_STREAM_NAME;
var region = process.env.AWS_REGION;

module.exports = class KinesisStream{
    
       /**
         * The following method will instantiate the Kinesis Stream
         *
         */
        constructor ( ){    
           this.kinesis = new AWS.Kinesis(
                {
                    apiVersion: '2013-12-02',
                    accessKeyId:accessKey,
                    secretAccessKey:secretKey,
                    region:region
                }
            );
        }
    
       /**
         * The following message will send the logs to the kinesis stream
         * @param {*} messages
         */
        sendLogsToStream( messages ){
            let records = [];

            /**
             * The following function will properly format a record for 
             * kinesis stream
             * @param {*} msg 
             * @param {*} partitionKey 
             */
            function createKinesisRecord( msg, partitionKey ){
                return {
                    Data: msg,
                    PartitionKey:partitionKey
                }

           }

           if( typeof messages !== 'undefined' && messages.length > 0 ){
                let records = messages.map( msg =>{
                    return createKinesisRecord( msg );
                } );

               let kinesisParams = {
                    Data: records,
                    StreamName:DeliveryStreamName
                }
            }
        }
    };