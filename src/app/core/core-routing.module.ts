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
      {
        path:'verificacion',
        canActivateChild: [NgxPermissionsGuard],
        loadChildren: '../components/verificacion/verificacion.module#VerificacionModule',
        data: {
          title: 'Verificacion',
          permissions: {
            only: 'VERIFICACION',
            redirectTo: '/'
          }
        }
      },
      {
        path:'turismo',
        canActivateChild: [NgxPermissionsGuard],
        loadChildren: '../components/turismo/turismo.module#TurismoModule',
        data: {
          title: 'Turismo',
          permissions: {
            only: 'TURISMO',
            redirectTo: '/'
          }
        }
      },
      {
        path:'panico',
        canActivateChild: [NgxPermissionsGuard],
        loadChildren: '../components/panic/panic.module#PanicModule',
        data: {
          title: 'Panico',
          permissions: {
            only: 'PANICO',
            redirectTo: '/'
          }
        }
      },
      {
        path:'usuariosA',
        canActivateChild: [NgxPermissionsGuard],
        loadChildren: '../components/usuarios/usuarios.module#UsuariosModule',
        data: {
          title: 'Usuarios App',
          permissions: {
            only: 'USUARIOSA',
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