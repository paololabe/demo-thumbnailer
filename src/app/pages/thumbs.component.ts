import { ThumbsService } from './thumbs.service';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Thumb } from './thumb.model';

import { Router, ActivatedRoute, Params, Data } from '@angular/router';


@Component({
    templateUrl: 'thumbs.component.html'
})
export class ThumbsComponent implements OnInit {
    constructor(
        private thumsService:ThumbsService,
        private route: ActivatedRoute,
    private router: Router
) { }

    list: Thumb[]=[];

    public size=360;
    

    uploadComplete(){
        this.loadData();
    }

    loadData(){
        this.thumsService.loadFiles(this.size,(err,data)=>{
            console.log(err,data);
            this.list=<Thumb[]>data.Items;
        })
    }

    checkUrl(index){
        console.log("no image",index);
        //let img=$event.target.src="https://placehold.it/" + this.size + "x" + this.size;
        //this
        let fname=this.list[index].filename;
        this.list[index].filename="placeholder.png";
        setTimeout(()=>this.list[index].filename=fname, 1000);

    }

    delete(item:Thumb){
        this.thumsService.delete(this.size,item.key,()=>this.loadData());
    }

    ngOnInit() {
        
        this.size=+this.route.snapshot.params['size'];

        this.loadData();

     }


}