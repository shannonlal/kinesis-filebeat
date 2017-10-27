'use strict';

var AWS = require('aws-sdk');
const fs = require('fs');

//var accessKey = process.env.AWS_ACCESS_KEY;
//var secretKey = process.env.AWS_SECRET_KEY;
//var DeliveryStreamName = process.env.AWS_KINESIS_STREAM_NAME;
var region = process.env.REGION;

const OUTPUT_FILE = process.env.OUTPUT_FILE;

module.exports = class KinesisLogProcess{
    
    /**
     * The following method will instantiate the Kinesis Stream
     *
     */
    constructor ( ){    
        this.wstream = fs.createWriteStream(OUTPUT_FILE);

        /*let params = {
            apiVersion: '2013-12-02',
            accessKeyId:accessKey,
            secretAccessKey:secretKey,
            region:region
        };

        console.log('kinesis stream', params);
        this.kinesis = new AWS.Kinesis(
            params
        );*/
    }

    /**
     * The following message will send the logs to the kinesis stream
     * @param {*} messages
     */
    sendLogsToStream ( messages ){
        let records = [];
        let self = this;

        return new Promise ((resolve, reject)=>{
            
            console.log( 'Writing messages ');
            messages.map( msg =>{
                self.wstream.write( msg );
            });
            resolve('Wrote messages');
        });

        /*return new Promise( (resolve, reject)=>{
            /**
             * The following function will properly format a record for 
             * kinesis stream
             * @param {*} msg 
             * @param {*} partitionKey 
             */
            /*function createKinesisRecord ( msg, partitionKey ){
                return {
                    Data: msg,
                    PartitionKey:partitionKey
                };
            };

            /**
             * The following method will push the logs to kinesis
             * @param {*} params 
             */
            /*function putLogsToKinesis ( params ){

                return new Promise( (resolve, reject) =>{
                    console.log( 'Sending in put logs to kinesis', params);
                    //resolve( 'processed ');
                    self.kinesis.putRecords( params, (error,data) =>{
                        console.log('put records');
                        if( error ){
                            console.log('Error sending response');
                            reject( error );
                        }else{
                            let result = {
                                messagesSent: params.Records.length,
                                messagesProcessed: data.Records.length,
                                messagesErrored: data.FailedRecordCount,
                                allRecordsProcessed: (params.Records.length = data.Records.length)
                            }
                            console.log( 'Data sent ', result);
                            resolve( data );
                        }
                    } );
                });
            }

            if( typeof messages !== 'undefined' && messages.length > 0 ){
                let partitionKey = `PartitionKey->${parseInt(Math.random()*12)}`;
                let records = messages.map( msg =>{
                    //console.log('Message from queue', msg);
                    let r = createKinesisRecord( msg, partitionKey );
                    //console.log( 'msg',r);
                    return r;
                });

                //console.log( 'records', records);
                let kinesisParams = {
                    Records: records,
                    StreamName:DeliveryStreamName
                };

                return putLogsToKinesis( kinesisParams );
            }else{
                return Promise.resolve( 'No logs to send');
            }
        });*/

    }
};