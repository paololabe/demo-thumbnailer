import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';


@Injectable()
export class ThumbsService {

    private s3Folder="uploads360/tmp/"
    
    
    constructor() { 

        AWS.config.accessKeyId='pippo';
        AWS.config.secretAccessKey='pippo';
        AWS.config.region="eu-west-1";


    }

    upload(size: number,file:File,cb){
        
        let s3Folder= 'uploads' + size + '/';

        let bucket = new AWS.S3({params: {Bucket: 'labe-storage'}});

        let params:any = {Key: s3Folder + file.name, Body: file, ACL: 'public-read'};

        bucket.upload(params, function (err, data) {

            console.log(err, data);
            if(!err){
            let client=new AWS.DynamoDB.DocumentClient();
            
            let params:any={
                        TableName:'images'+size,
                        Item:{key:file.name,name:file.name,filename:file.name,size:size}};
            client.put(params,function(err,data){
                console.log(err,data);
                if(cb)cb(err);
            });

            }
        });   
    }

    loadFiles(size,cb){
            let client=new AWS.DynamoDB.DocumentClient();
            client.scan({TableName:'images'+size},function(err,data){
                console.log(err,data);
                if(cb)cb(err,data);
            });
    }


    delete(size,key:string,cb){
        let params = {
                        TableName:"images" + size,
                        Key:{"key":key}
                    };
        let client=new AWS.DynamoDB.DocumentClient();
        client.delete(params, function(err, data) {
            if (err) {
                console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                if(cb) cb();
            }
});
    }
}