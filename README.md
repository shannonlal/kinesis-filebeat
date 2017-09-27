# kinesis-filebeat

The following project is a simple docker container which will read a local log file
and send all messages to Kinesis stream on a fixed interval

## TODO
1. Integrate kinesis stream and start to test
2. Write your own process to send a log message to new Kinesis Firehose
3. Should read logs from queue.  Should use putmessages
4. Look at the following:  
http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Firehose.html#putRecordBatch-property
5. Need to implement retry logic.  Need to handle partial messages being sent or failed
6. Need to implement backoff logic for messages


Next steps
1. Simple log service to send a message to firehose and see if lambda function is called.
2. Exand this service to handle retry