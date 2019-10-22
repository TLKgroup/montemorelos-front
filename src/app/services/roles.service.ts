import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as __ from 'lodash'

import { Roles } from '../models/role';
import { adminLteConf } from '../admin-lte.conf';


import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})

export class RolesService {  

  constructor(
    private http: HttpClient
  ) {     
  }

  getRoles() {
    return this.http.get<any>(`${environment.url_api}roles`)
      .pipe(
        map(result => {
          return JSON.parse(JSON.stringify(result.Roles)).map((item) => {
            return new Roles(item.id_role, item.nombre_role);
          });
        })
      );
  }

  getRolesModulos(id_role: number) {

    return this.http.get<any>(`${environment.url_api}roles/${id_role}/modulos`)
      .pipe(
        map(result => {
          return result
        })
      );
  }

  getRolesPermisos(id_role: number) {

    return this.http.get<any>(`${environment.url_api}roles/${id_role}/modulos/permisos`)
      .pipe(
        map(result => {
          return result
        })
      );
  }

  getTreeRolesAll() {
    return this.http.get<any>(`${environment.url_api}roles/modulos`)
    .pipe(
      map(result => {
        return result
      })
    );
  }
  
  async getCheckedKeysPermissions(id_role: number): Promise<any>  {
    let defaultCheckedKeys = []; 
    let modulesRole = await this.getRolesPermisos(id_role).toPromise(); 

    if(modulesRole.Roles.length === 0) {
      return defaultCheckedKeys;
    }


    __.forEach(modulesRole.Roles[0].PermisosNivel1, (value1, key) => {

      defaultCheckedKeys.push(value1.nombre_permiso);

      if(value1.PermisosNivel2.length > 0) {       
        
        __.forEach(value1.PermisosNivel2, (value2, key) => {

          defaultCheckedKeys.push(value2.nombre_permiso);                    
  
        });

        defaultCheckedKeys = defaultCheckedKeys.filter(value => value1.nombre_permiso !== value);        
      }

    });    
    
    return defaultCheckedKeys;
  }

  async getCheckedKeysModules(id_role: number): Promise<any>  {
    let defaultCheckedKeys = [];
    let modulesRole = await this.getRolesModulos(id_role).toPromise(); 

    if(modulesRole.Roles.length === 0) {
      return defaultCheckedKeys;
    }

    __.forEach(modulesRole.Roles[0].ModulosPermisos, (valueModulos, key) => {

      defaultCheckedKeys.push(valueModulos.id_modulo);

    });    

    return defaultCheckedKeys;
  }

  async getTreePermissions(id_role: number) {
 
    let nodes = [];
    let Nivel1 = [];
    let Nivel2 = [];

    let modules = await this.getRolesModulos(id_role).toPromise();
    let permissions = await this.getTreeRolesAll().toPromise();

    if(modules.Roles.length === 0) {
      return nodes;
    }

    modules = modules.Roles[0].ModulosPermisos;      
    permissions = permissions.Modulos;
    
    __.forEach(modules, (valueModule, key) => {
      
      nodes.push({
        title: valueModule.nombre_modulo,
        key: `${String(valueModule.nombre_modulo).toLowerCase()}-${valueModule.id_modulo}`
      });

      __.forEach(permissions, (valueModuleP, keyModule) => {

        if(valueModule.id_modulo === valueModuleP.id_modulo) {

          Nivel1 = [];
          Nivel2 = [];

          __.forEach(valueModuleP.Permisos_Nivel_1s, (valueNivel1, keyNivel1) => {

            Nivel1.push({
              title: valueNivel1.descripcion,
              key: valueNivel1.nombre_permiso,
              isLeaf: true
            });
  
            if(valueNivel1.Permisos_Nivel_2s.length > 0) {
              
              Nivel1[keyNivel1].isLeaf = false;
  
              __.forEach(valueNivel1.Permisos_Nivel_2s, (valueNivel2, keyNivel2) => {
  
                Nivel2.push({
                  title: valueNivel2.descripcion,
                  key: valueNivel2.nombre_permiso,
                  isLeaf: true
                });
  
              });
  
              Nivel1[keyNivel1].children = Nivel2;
  
            }
  
          })
            
        }

        
      });
      
      nodes[key].children = Nivel1;

    });

    return nodes;
  }

  async getTreeModules() {
    let nodes = [];
    
    let modules = await this.getTreeRolesAll().toPromise();
    modules = modules.Modulos;      
    
    __.forEach(modules, (value, key) => {

      nodes.push({
        title: value.nombre_modulo,
        key: value.id_modulo,
        isLeaf: true
      });

    });

    return nodes;
  }

  async getPermissions(id_role: number): Promise<any> {
    let permissions = [];
    let modulesRole = await this.getRolesPermisos(id_role).toPromise(); 

    if(modulesRole.Roles.length === 0) {
      return permissions;
    }
    
    __.forEach(modulesRole.Roles[0].ModulosPermisos, (valueModulos, key) => {

      console.log(modulesRole.Roles[0].ModulosPermisos);

      __.forEach(valueModulos.PermisosNivel1, (value1, key) => {

        permissions.push(value1.nombre_permiso);

        __.forEach(value1.PermisosNivel2, (value2, key) => {

          permissions.push(value2.nombre_permiso);                    
  
        });
        
      });

    });    

    return permissions;
  }

  addRole(role: Roles, modulos: any[]) {

    let data = {
      id_role: role.id_role,
      nombre_role: role.nombre_role,
      modulos
    }             

    return this.http.post<any>(`${environment.url_api}roles`, data)
    .pipe(
        map(result => {                
            return result;
        })
    );
  }

  addModule(role: Roles, modulos: any[]) {      


    return this.http.put<any>(`${environment.url_api}roles/${role.id_role}/modulos`, {modulos})
    .pipe(
        map(result => {                
          return result;
        })
    );
  }

  updatePermissions(role: Roles, permisos: any[]) {

    let data = {
      nombre_role: role.nombre_role,
      permisos
    }       

    return this.http.put<any>(`${environment.url_api}roles/${role.id_role}/modulos/permisos`, data)
    .pipe(
        map(result => {                
          return result;
        })
    );
  }

  deleteRole(id_role: string) {

    return this.http.delete<any>(`${environment.url_api}roles/${id_role}`)
    .pipe(
        map(result => {                
            return result;
        })
    );
  }

  countRoleUser(id_role: string){

    return this.http.get<any>(`${environment.url_api}roles/${id_role}/count`)
    .pipe(
      map(result => {      
        return JSON.parse(JSON.stringify(result.Users)).map(item => {        
          return new User(
            item.id_usuario,
            item.nombre_empleado,
            item.nombre_usuario,
            item.contrasena,
            item.id_role 
          )
        })
      })
    );
  }

  async setMenuPermissions(id_role: number): Promise<any>  {

    let namesModules = [];
    let adminConfig = [];
    let modulesRole = await this.getRolesModulos(id_role).toPromise(); 

    if(modulesRole.Roles.length === 0) {
      return namesModules;
    }

    await __.forEach(modulesRole.Roles[0].ModulosPermisos, (valueModulos, key) => {

      namesModules.push(String(valueModulos.nombre_modulo).toLowerCase().replace('/', ''));
      
    });   
    
    await __.forEach(namesModules, (value, index) => {

      __.forEach(adminLteConf.sidebarLeftMenu, value2 => {

        if(value === String(value2.route).toLowerCase().replace('/', '')) {
          adminConfig.push(value2);
        }

      });

    });

    adminConfig = __.orderBy(adminConfig, ['nombre_modulo'], ['asc', 'desc']);

    adminConfig.unshift(adminLteConf.sidebarLeftMenu[1]);
    adminConfig.unshift(adminLteConf.sidebarLeftMenu[0]);
    
    return adminConfig;
  }

  async getModulos(id_role: number): Promise<any[]> {

    let nameModules = [];
    let modulesRole = await this.getRolesModulos(id_role).toPromise(); 

    if(modulesRole.Roles.length === 0) {
      return nameModules;
    }

    __.forEach(modulesRole.Roles[0].ModulosPermisos, (valueModulos, key) => {

      nameModules.push(String(valueModulos.nombre_modulo).toUpperCase().trim());

    });    

    return nameModules;
  }

}