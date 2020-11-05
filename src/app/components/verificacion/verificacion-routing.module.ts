import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VerificacionComponent } from './verificacion.component';

const routes: Routes = [
  {
    path: '',
    component: VerificacionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerificacionRoutingModule { }
