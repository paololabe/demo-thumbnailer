import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { Ng2ImgFallbackModule } from 'ng2-img-fallback';

import { AppComponent } from './app.component';

//bootstrap directives
import { AlertModule,ProgressbarModule } from 'ng2-bootstrap';


import { AppRoutingModule } from './app.routing';

//components
import { ThumbsComponent } from './pages/thumbs.component';
import { FileUploadComponent } from './shared/file-upload.component';

//pipes
import { BytesPipe } from './shared/bytes.pipe';

//services
import { SharedService } from './shared/shared.service';
import { ThumbsService } from './pages/thumbs.service';

//directives
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload/ng2-file-upload';

@NgModule({
  declarations: [
    AppComponent,
    ThumbsComponent,
    FileSelectDirective, FileDropDirective, FileUploadComponent, BytesPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AlertModule.forRoot(),
    ProgressbarModule.forRoot(),
    AppRoutingModule,
    Ng2ImgFallbackModule
    
  ],
  providers: [SharedService,ThumbsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
