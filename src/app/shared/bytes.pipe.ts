import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'bytes'})
export class BytesPipe implements PipeTransform {
  transform(value: number): string {
    var umArr=['B','KB','MB','GB'];
    
   
    function reduce(v:number,i:number){
        var obj={value:v,um:umArr[i]};
        v=v/1024;
        if(v<1 || i==3){
            return obj;
        }
        else{
            i++;
            return reduce(v,i);
        }
        
    }

    var o=reduce(value,0);

    return Math.round(o.value * 10) / 10 + '' + o.um;
  }
}