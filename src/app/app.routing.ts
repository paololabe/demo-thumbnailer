import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';



// Layouts
import { ThumbsComponent } from './pages/thumbs.component';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home/360',
    pathMatch: 'full',
  },
  {
    path: 'home/:size',
    component: ThumbsComponent
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
