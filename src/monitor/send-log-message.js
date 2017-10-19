var AWS = require('aws-sdk');

var accessKey = process.env.AWS_ACCESS_KEY;
var secretKey = process.env.AWS_SECRET_KEY;
var DeliveryStreamName = process.env.AWS_FIREHOSE_DELIVERY_STREAM_NAME;
var region = process.env.AWS_REGION;

var firehose = new AWS.Firehose(
    {apiVersion: '2015-08-04',
    accessKeyId:accessKey,
    secretAccessKey:secretKey,
    region:region
    }
);


var params = {
    DeliveryStreamName: DeliveryStreamName,
    Records: [ 
      {
        Data:'STRING_VALUE 1' 
      },
      {
        Data:'STRING_VALUE 2' 
      }
    ]
  };

firehose.putRecordBatch(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });