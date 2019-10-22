import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [ 
    {
        path: '',
        canActivate: [AuthGuard],
        loadChildren: './core/core.module#CoreModule',
        data: {
            title: 'Inicio'
        }
    },
    {
        path: 'login',
        loadChildren: './components/login/login.module#LoginModule',      
        data: {
            title: 'Iniciar Sesion',
            customLayout: true
        },
    },
    {
        path: '**',
        redirectTo: ''
    }
];


@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
  })
  
export class AppRoutingModule { }
