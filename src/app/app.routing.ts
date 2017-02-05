import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';



// Layouts
import { ThumbsComponent } from './pages/thumbs.component';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'page1/360',
    pathMatch: 'full',
  },
  {
    path: 'page1/:size',
    component: ThumbsComponent
  },
  {
    path: 'page2/:size',
    component: ThumbsComponent
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
