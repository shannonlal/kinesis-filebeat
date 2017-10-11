# kinesis-filebeat

The following project is a simple docker container which will read a local log file
and send all messages to Kinesis stream on a fixed interval

## TODO
1. Integrate kinesis stream and start to test
1b. Poll the Queue every 10 seconds and clear it off and dump to queue
1c. Dump the error to DLQ log 
2. Write your own process to send a log message to new Kinesis Firehose
3. Should read logs from queue.  Should use putmessages
4. Look at the following:  
http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Firehose.html#putRecordBatch-property
5. Need to implement retry logic.  Need to handle partial messages being sent or failed
6. Need to implement backoff logic for messages


Next steps
1. send-log-message needs to read messages from queue.  And test is to put messages onto log-queu on timer
2. Expand this service to handle retry
3. Test sending the log file to firehose
4. Tail an actual log file and send to firehose