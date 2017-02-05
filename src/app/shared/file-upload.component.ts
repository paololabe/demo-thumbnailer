import { ErrorCollector } from '@angular/compiler';
import { ThumbsService } from '../pages/thumbs.service';
import { Component, OnInit,EventEmitter,Output,Input,ViewChild,ElementRef } from '@angular/core';

import {SharedService} from './shared.service';

import { FileSelectDirective, FileDropDirective, FileUploader,ParsedResponseHeaders,FileItem } from 'ng2-file-upload/ng2-file-upload';

@Component({
    selector:"file-upload",
    templateUrl: 'file-upload.component.html'
})
export class FileUploadComponent implements OnInit {

    
    private uploadApi="";

    public uploader:FileUploader;
    public hasBaseDropZoneOver:boolean = false;
    public srcUploads="";
    public lastImageAddedBase64="";

    @ViewChild('fileSelect') fileSelect:ElementRef;
    @Input('namepostfix') type:string;
    
    @Output() uploadComplete = new EventEmitter<any>();

    @Input() size=360;

    constructor(private sharedService: SharedService,private thumbsService:ThumbsService) { 

        this.srcUploads=sharedService.srcUploadPath;
        
        //this.uploader.autoUpload=true;
        
    }

    public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }
  public onFileDrop(files:File[]){
        console.log(files);
        let _this=this;
        let reader = new FileReader();
        let b= new Blob([files[0].slice()],{type:files[0].type});
        reader.readAsDataURL(b);
        reader.onloadend = function() {
        _this.lastImageAddedBase64 = <string>reader.result;
        console.log(_this.lastImageAddedBase64 );
  }
  }

  
    ngOnInit() {
       
        this.uploadApi=this.sharedService.apiResourcePath+"res-upload/" + (this.type?this.type:'');
        this.uploader = new LTUploader({url: this.uploadApi});

        this.uploader.onSuccessItem = (item:FileItem, response:string, status:number, headers:ParsedResponseHeaders) => {
            console.log("onSuccessItem " + status, item,response,headers);
            this.uploader.clearQueue();
            this.uploadComplete.emit(response);
         }

        
    }

    browseFile(){
        this.fileSelect.nativeElement.click();
    }

    upload(){
        //this.uploader.uploadAll();
        this.thumbsService.upload(this.size,this.uploader.queue[0]._file,
        (err)=>{
            if(!err){
                this.uploader.clearQueue();
                this.uploadComplete.emit();
            }
        }
        );
    }

    getImage(){
        this.uploader.queue[0];
    }

    addFile(file:File){
        this.uploader.addToQueue([file]);
    }


}

class LTUploader extends FileUploader {
  onAfterAddingFile(file: any) {
    file.withCredentials = false;
  }
}