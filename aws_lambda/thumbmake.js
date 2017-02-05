var AWS = require('aws-sdk');
var S3 = new AWS.S3();
var fs= require('fs');
var path = require('path');
const im = require('imagemagick');


 var BUCKET = 'labe-storage';
// var URL = process.env.URL;

exports.handler = function(event, context, cb) {
  var key = (event.key?event.key:"nokey");
  if(key!='nokey'){
  var match = key.match(/(\d+)\/(.*)/);
  if(match){
  var size = parseInt(match[1], 10);
  var fname= match[2];
  var originalKey = "uploads" + size + "/" + fname ;
  
  console.log(width,height,originalKey);
  
    }
    console.log(width,height,originalKey);
  }
  else
  {
      //recover resource from bucket event
    const bucket = event.Records[0].s3.bucket.name;
    key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    console.log("put file",key);
    match = key.match(/uploads(\d+)\/(.*)/);
    var size=parseInt(match[1], 10);
    fname= match[2];
    console.log("size",size);

    const params = {
        Bucket: bucket,
        Key: key
    };

    
    originalKey=key;
  }

  var width=size;
  var height=size;

  //var destKey= "images" + size + "/" + fname;
  var destKey= "images" + size + "/" + fname;
  var resizedFile = "/tmp/" + fname;
    console.log("opening",originalKey);
   S3.getObject({Bucket: BUCKET, Key: originalKey}).promise()
    // .then((data) => Sharp(data.Body)
    //     .resize(width, height)
    //     .toFormat('png')
    //     .toBuffer()
    // )
    .then((data)=>{
        console.log("resize ...");
        im.resize({
          srcData: data.Body,
          dstPath: resizedFile,
          width:   width,
          height: height,
        }, function(err, stdout, stderr){
          if (err) cb(err);
          console.log(stdout);
          console.log("save to ",destKey);
          S3.putObject({
            Body: new Buffer(fs.readFileSync(resizedFile)),
            Bucket: BUCKET,
            ContentType: data.ContentType,
            Key: destKey,
            //ACL: 'public-read'
          },(err,data)=>{
              if(err)console.log("error",err);
              console.log("success",data);
          });
          
        });
    })
    
     .then(() =>{
    //     fs.unlinkSync(resizedFile);
         cb(null,"OK");
     })
    
    .catch((err) => cb(err))
}
