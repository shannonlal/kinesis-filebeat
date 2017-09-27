var AWS = require('aws-sdk');

var accessKey = process.env.AWS_ACCESS_KEY;
var secretKey = process.env.AWS_SECRET_KEY;
var DeliveryStreamName = process.env.AWS_FIREHOSE_DELIVERY_STREAM_NAME;

var firehose = new AWS.Firehose(
    {apiVersion: '2015-08-04',
    accessKeyId:accessKey,
    secretAccessKey:secretKey
    }
);


var params = {
    DeliveryStreamName: 'STRING_VALUE', /* required */
    Records: [ /* required */
      {
        Data: new Buffer('...') || 'STRING_VALUE' /* Strings will be Base-64 encoded on your behalf */ /* required */
      },
      /* more items */
    ]
  };

  firehose.putRecordBatch(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });