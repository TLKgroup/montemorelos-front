import { Component, OnInit } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { NgxRolesService } from "ngx-permissions";
import { RolesService } from '../services/roles.service';


/* User Info */
import { AuthentificationService } from '../services/authentification.service';
import { User } from '../models/user';

import { LayoutStore } from 'angular-admin-lte';


@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.css']
})

export class CoreComponent implements OnInit {

  public currentUser: User;
  modules: string[];

  constructor(
    private permissionsService: NgxPermissionsService,    
    private authenticationService: AuthentificationService,
    private rolesServices: RolesService,
    private layoutStore: LayoutStore,
    private ngxrolesService: NgxRolesService
  ) { 
    this.currentUser = this.authenticationService.currentUserValue;

    this.rolesServices.getCheckedKeysPermissions(Number(this.authenticationService.currentUserValue.id_role))
    .then(permissions => {      
      this.permissionsService.loadPermissions(permissions);
    });

    this.rolesServices.getModulos(Number(this.currentUser.id_role)).then(modules => { 
      modules.forEach(value => {
        this.ngxrolesService.addRole(value, () => true); 
      });                 
      console.log(this.ngxrolesService.getRoles());
    });    


    this.rolesServices.setMenuPermissions(Number(this.currentUser.id_role))
    .then(config => {
      this.layoutStore.setSidebarLeftMenu(config);
    });
  }

  ngOnInit(): void {    
    

  }


  getYear(){
    return (new Date()).getFullYear();
  }


}