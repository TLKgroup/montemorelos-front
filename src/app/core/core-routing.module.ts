import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from "ngx-permissions";
import { CoreComponent } from './core.component';

const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    children: [
      {
        path: '',
        loadChildren: '../components/home/home.module#HomeModule'
      },
      {
        path:'usuarios',
        canActivateChild: [NgxPermissionsGuard],
        loadChildren: '../components/users/users.module#UsersModule',
        data: {
          title: 'Usuarios',
          permissions: {
            only: 'USUARIOS',
            redirectTo: '/'
          }
        }
      },
      {
        path:'reportes',
        canActivateChild: [NgxPermissionsGuard],
        loadChildren: '../components/reports/reports.module#ReportsModule',
        data: {
          title: 'Reportes',
          permissions: {
            only: 'REPORTES',
            redirectTo: '/'
          }
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }