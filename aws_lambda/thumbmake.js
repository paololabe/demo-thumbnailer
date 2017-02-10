var AWS = require('aws-sdk');
var S3 = new AWS.S3();
var fs = require('fs');
var path = require('path');
const im = require('imagemagick');

//change this to change target bucket
//TODO: pass this value through AWS lamda console
const BUCKET = 'labe-storage'; //<-- could take it from event info 

/**
 * thumbmake.js
 * Author: Paolo L.
 * 
 * Export an AWS Lambda handler designed to be activated by a S3 bucket event 
 * to resize new file and upload it back to S3
 * 
 * @param {any} event   event raised by S3 conytaining file info 
 * @param {any} context info about enviroment (not used here)
 * @param {any} cb      call back used by AWS enviroment
 * 
 * TODO: 
 * refactory on key parsing and to improve promises flow
 * send a feedback if function fails
 */
exports.handler = function (event, context, cb) {
  
  var size;         //new size for the image file
  var fname;        //file name
  var originalKey;  //path/key of the new uploaded image rising event
  
  var key = (event.key ? event.key : "nokey");
  //Checking key to understand who is calling the handler
  //for developing purpose I can call the handler from simple AWS test engine
  if (key != 'nokey') {
   
    //calling from AWS test
    var match = key.match(/(\d+)\/(.*)/);
    if (match) {
        size = parseInt(match[1], 10);
        fname = match[2];
        originalKey = "uploads" + size + "/" + fname;
      }
  }
  else {
    //Calling from 
    //An put event is coming from the target bucket
    //becaouse a trigger is configured in asw lambda

    //parsing bucket info
    const bucket = event.Records[0].s3.bucket.name;

    //extract the new file path 
    key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    console.log("put file", key);

    //extract size from path, just to know the destination size
    //the file can be placed in uploads360 or uploads120 
    match = key.match(/uploads(\d+)\/(.*)/);

    //first group is the size
    var size = parseInt(match[1], 10);

    //second group is the file name
    fname = match[2];
    console.log("size", size);

    //params for S3 API
    const params = {
      Bucket: bucket,
      Key: key
    };

    //I have to copy file in a different folder so save the original path
    originalKey = key;
  }

  //the image will fit this square mantaining aspect ratio
  var width = size;
  var height = size;

  //set the destination path based on size
  var destKey = "images" + size + "/" + fname;

  //I've to save the resized stream in a local tmp folder before uploading it
  //TODO: Investigate why saving the resized stream directly on S3 create a broken image
  var resizedFile = "/tmp/" + fname;
  console.log("opening", originalKey);
  
  //download the put file from S3 bucket
  S3.getObject({ Bucket: BUCKET, Key: originalKey }).promise()

    .then((data) => {
      console.log("resize ...");
      
      //resize and save to tmp
      im.resize({
        srcData: data.Body,
        dstPath: resizedFile,
        width: width,
        height: height,
      }, function (err, stdout, stderr) {
        if (err) cb(err);
        
        console.log("save to ", destKey);

        //upload from tmp to S3
        //Note: ACL is mandatory otherwise the page will display broken image due to access denied
        //to set ACL, Lambda function context must have PutObjectACL permission
        S3.putObject({
          Body: new Buffer(fs.readFileSync(resizedFile)),
          Bucket: BUCKET,
          ContentType: data.ContentType,
          Key: destKey,
          ACL: 'public-read'  //<-- err 404 in page if missed
        }, (err, data) => {
          if (err) console.log("error", err);
          console.log("success", data);
        });

      });
    })

    .then(() => {
      // It seems not necessary to dele file saved in tmp
      //     fs.unlinkSync(resizedFile);
      cb(null, "OK");
    })

    .catch((err) => cb(err))
}
