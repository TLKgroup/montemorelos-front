import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TurismoComponent } from './turismo.component';

const routes: Routes = [
  {
    path: '',
    component: TurismoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class TurismoRoutingModule { }
