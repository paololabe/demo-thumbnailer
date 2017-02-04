import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';



// Layouts
import { ThumbsComponent } from './pages/thumbs.component';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: ThumbsComponent,
    data: {
      title: 'First Thumbnailer'
    }
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
