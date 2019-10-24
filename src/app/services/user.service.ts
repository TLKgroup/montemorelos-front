import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { AuthentificationService } from '../services/authentification.service';

import { Observable } from 'rxjs';
import { User } from '../models/user';

import { reject } from 'q';


@Injectable({
    providedIn: 'root'
})

export class UserService {
    observable:Observable<User[]>;  
    public currentUser;
    public urlAPI;

    constructor(private http: HttpClient, private authenticationService: AuthentificationService) {
        this.currentUser = this.authenticationService.currentUserValue;
    }

    getUsers(): Observable<User[]> {
        return this.http.get<any>(`${environment.url_api}usuario`)
        .pipe(
            map(result => {
                return JSON.parse(JSON.stringify(result.Usuarios)).map(item => {                
                    return new User(
                        item.id_usuario,
                        item.nombre_empleado,
                        item.nombre_usuario,
                        item.contrasena,
                        item.id_role,
                        item.token,
                        item.status,
                        item.fecha_creacion,
                        item.creado_por,
                        item.fecha_ultima_modificacion,
                        item.fecha_modificacion_por,
                        item.Role.nombre_role
                    );
                });
            })
        );
    }

    addUser(user: User){
        let data = {
            nombre_empleado: user.nombre_empleado,
            nombre_usuario: user.nombre_usuario,
            contrasena: user.contrasena,
            id_role: user.id_role
        }

        return this.http.post<any>(`${environment.url_api}usuario`, data)
        .pipe(
            map(result => {                           
                if(result.OK) {
                    return result.Usuario;
                } else {
                    return reject;
                }
            })
        );  
    }

    updateUser(nombre_empleado: string, nombre_usuario: string, contrasena: string) {

        let data = {
            nombre_empleado: nombre_empleado,
            nombre_usuario: nombre_usuario,
            contrasena: contrasena
        }
        
        return this.http.put<any>(`${environment.url_api}usuarioperfil/${this.currentUser.id_usuario}`, data)
        .pipe(map (result=> {                        
            if(result.OK){
                
            }
            return result;
        }));
    }
    
    updateUsers(user: User) {

        let data = {
            nombre_empleado: user.nombre_empleado,
            nombre_usuario: user.nombre_usuario,
            contrasena: user.contrasena,
            id_role: user.id_role
        }
        
        return this.http.put<any>(`${environment.url_api}usuario/${user.id_usuario}`, data)
        .pipe(map (result=> {                                              
            if(result.OK){
                return result;
            } else {
                return reject();
            }
        }));
    }

    deleteUser(id_usuario: string){
        return this.http.delete<any>(`${environment.url_api}usuario/${id_usuario}`)
        .pipe(
            map(result => {                
                return result;
            })
        );
    }

}