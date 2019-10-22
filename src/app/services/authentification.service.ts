import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/user';

import { RolesService } from '../services/roles.service';
import { NgxPermissionsService } from 'ngx-permissions';

@Injectable({
    providedIn: 'root'
})
export class AuthentificationService {
    private currentUserSubject: BehaviorSubject<User>
    public currentUser: Observable<User>;

    constructor(
        private http: HttpClient,
        private permissionsService: NgxPermissionsService,
        private roleService: RolesService){
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }
    
    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string){
        let data = {
            nombre_usuario: username,
            contrasena: password
        }        
        return this.http.post<any>(`${environment.url_api}iniciar_sesion`, data)
        .pipe(map (user=> {

            if(user && user.token) {                
                let userLogin = {
                    id_role: user.usuario.id_role,
                    id_usuario: user.usuario.id_usuario,
                    nombre_empleado: user.usuario.nombre_empleado,
                    nombre_usuario: user.usuario.nombre_usuario,
                    token: user.token,
                    contrasena: null
                }

                localStorage.setItem('currentUser', JSON.stringify(userLogin));
                this.currentUserSubject.next(userLogin);

                this.roleService.getCheckedKeysPermissions(Number(userLogin.id_role))
                .then(permissions => {
                    console.log("TCL: AuthentificationService -> login -> permissions", permissions)
                    this.permissionsService.loadPermissions(permissions);
                });

                
            }

            return user;
        }));
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    updatePermissions() {
        this.roleService.getCheckedKeysPermissions(Number(this.currentUserValue.id_role))
        .then(permissions => {
        console.log("TCL: CoreComponent -> permissions", permissions)
        this.permissionsService.loadPermissions(permissions);
        });
    }

}