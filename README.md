# kinesis-filebeat
The following project is a simple docker container which will read a local log file
and send all messages to Kinesis stream on a fixed interval


#Test run 

1. `docker build -t kinesis-filebeat .`
2. cd into kinesis-filebeat/examples
2a. Update .env file in here for your environment
3. docker-compose up -d
4. from kinesis-filebeat 
4a. Create .env file (look at .env-sample)
4b npm run debug-gen

# Docker Instruction
To build the Docker Image you must have Docker installed on your machine.  To 
build docker run the following command:

## Build the Docker Image
NOTE Space before period
`docker build -t kinesis-filebeat .`

## Verify that your Docker Image was built
`docker images`

## To Run the docker image
`docker run -d -id -e "LOG_FILE=./logs/test.log" -e PUSH_INTERVAL=10000 kinesis-filebeat `

## To view list of Docker Containers
`docker ps`


## To execute with node
pm2 start src/index.js --no-daemon -x -- ${LOG_FILE} ${PUSH_INTERVAL} ${AWS_ACCESS_KEY} ${AWS_SECRET_KEY} ${AWS_KINESIS_STREAM_NAME}

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
7. No file present.  Must Retry the logic again


Next steps
1. send-log-message needs to read messages from queue.  And test is to put messages onto log-queu on timer
2. Expand this service to handle retry
3. Test sending the log file to firehose
4. Tail an actual log file and send to firehose
