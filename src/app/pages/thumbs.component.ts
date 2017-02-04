import { ThumbsService } from './thumbs.service';
import { Component, OnInit } from '@angular/core';
import { Thumb } from './thumb.model';


@Component({
    templateUrl: 'thumbs.component.html'
})
export class ThumbsComponent implements OnInit {
    constructor(private thumsService:ThumbsService) { }

    list: Thumb[]=[
        {key:'1',name:'image 1',filename:''},
        {key:'2',name:'image 2',filename:''},
        {key:'3',name:'image 3',filename:''},
    ];


    ngOnInit() {

        this.thumsService.loadFiles((err,data)=>{
            console.log(err,data);
            this.list=<Thumb[]>data.Items;
        })

     }


}