import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';


@Injectable()
export class ThumbsService {

    
    
    constructor() { 

        AWS.config.accessKeyId='AKIAIWVMCQRZUQSR53XQ';
        AWS.config.secretAccessKey='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';
        AWS.config.region="eu-west-1";


    }

    upload(file:File){
        
        let bucket = new AWS.S3({params: {Bucket: 'labe-storage'}});

        let params:any = {Key: file.name, Body: file};

        bucket.upload(params, function (err, data) {

            console.log(err, data);
            if(!err){
            let client=new AWS.DynamoDB.DocumentClient();
            
            let params:any={
                        TableName:'images',
                        Item:{key:file.name,name:file.name,filename:file.name}};
            client.put(params,function(err,data){
                console.log(err,data);
            });

            }
        });   
    }

    loadFiles(cb){
            let client=new AWS.DynamoDB.DocumentClient();
            client.scan({TableName:'images'},function(err,data){
                console.log(err,data);
                if(cb)cb(err,data);
            });
    }
}