import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PanicComponent } from './panic.component';

const routes: Routes = [
  {
    path: '',
    component: PanicComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanicRoutingModule { }
