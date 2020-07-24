  
import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';

import { ToastrService } from 'ngx-toastr';

import { RolesService } from '../../services/roles.service';
import { Roles } from 'src/app/models/role';
import { User } from 'src/app/models/user';
import { AuthentificationService } from "../../services/authentification.service";

import * as __ from 'lodash';

import { NzFormatEmitEvent } from 'ng-zorro-antd';

import { LayoutStore } from 'angular-admin-lte';
import { NgxRolesService } from "ngx-permissions";


@Component({
    selector: 'app-sidebar-right-inner',
    templateUrl: './sidebar-right-inner.component.html',
    styleUrls: ['./sidebar-right-inner.component.css']
})

export class SidebarRightInnerComponent implements OnInit, OnDestroy {
    
    defaultCheckedKeys = [];
    isLoading: boolean = true;

    public currentUser: User;

    isConfirmLoading:  boolean = false; 

    //mandar en [] vacio al  cerrar los modals
    checkedKeys = [];

    public nodes = [];
    
    nzEvent(event: NzFormatEmitEvent): void {                
        if(event.eventName == 'check') {
            this.checkedKeys = event.keys;
        }        
    }

    public role: Roles[] = [];

    public usuariosRole: User;

    public countRoles;

    public roleDataSelected: Roles;

    roles: Roles;

    AgregarRoleForm: FormGroup;
    EditarRoleForm: FormGroup;
    

    isVisibleAgregarRole = false;
    isConfirmLoadingAgregarRole = false;

    isVisibleAgregarModulo = false;
    isConfirmLoadingAgregarModulo = false;

    isVisibleMostrarPermisos = false;
    isConfirmLoadingMostrarPermisos = false;

    submittedAgregarRole = false;
    submittedEditarRole = false;

    submittedAgregarModulo = false;

    constructor(
        private modalService: NzModalService,
        private toastr: ToastrService,
        private formBuilder: FormBuilder,
        private rolesServices: RolesService,
        private authenticationService: AuthentificationService,
        private layoutStore: LayoutStore,
        private ngxrolesService: NgxRolesService
    ) {
        this.currentUser = this.authenticationService.currentUserValue;
     }

    ngOnInit() {        

        this.AgregarRoleForm = this.formBuilder.group({
            agregarRole: ['', Validators.required]
        });

        this.EditarRoleForm = this.formBuilder.group({
            editarRole: ['', Validators.required]
        });

        this.rolesServices.getRoles().
        subscribe(roles => {
            this.roles = roles;
            this.countRoles = Object.keys((__.countBy(this.roles, 'id_role'))).length; 
        }, err => {
            console.log(err);
        });
    }

    get arf() { return this.AgregarRoleForm.controls; }
    get erf() { return this.EditarRoleForm.controls; }

    ngOnDestroy() {
 
    }

    showModalAgregarRole(): void {
        this.isVisibleAgregarRole = true;
        this.AgregarRoleForm.get('agregarRole').setValue(null);
        this.rolesServices.getTreeModules().then(nodes => {
            this.nodes = nodes
            this.isLoading = false;
        }); 
    }

    handleCancelAgregarRole(): void {
        this.isVisibleAgregarRole = false;
        this.checkedKeys = [];

        this.submittedAgregarRole =  false;
        this.isLoading = true;
    }

    onSubmitAgregarRole(): void {

        this.submittedAgregarRole =  true;

        if(this.AgregarRoleForm.invalid) {
            return;
        }

        this.isConfirmLoadingAgregarRole = true;

        let role = new Roles(
            null,
            this.AgregarRoleForm.get('agregarRole').value
        ); 

        this.rolesServices.addRole(role, this.checkedKeys)
        .subscribe(result => {
            
            this.rolesServices.getRoles().
            subscribe(roles => {
                this.roles = roles;
                this.countRoles = Object.keys((__.countBy(this.roles, 'id_role'))).length;
                this.isConfirmLoadingAgregarRole = false;
                this.handleCancelAgregarRole();
                
                this.toastr.success('Rol creado exitosamente!'); 
            }, err => {
                console.log(err);
            });
              
        }, err => {
            this.isConfirmLoadingAgregarRole = false;
            this.toastr.success(err);  
        })

        this.submittedAgregarRole =  false;
    }

    showModalMostrarPermisos(data: any): void {        

        this.roleDataSelected = JSON.parse(JSON.stringify(data));      
        this.EditarRoleForm.controls['editarRole'].setValue(this.roleDataSelected.nombre_role);
        this.submittedEditarRole =  true;
   
        this.rolesServices.getTreePermissions(Number(this.roleDataSelected.id_role)).then(nodes => {            
            this.rolesServices.getCheckedKeysPermissions(Number(this.roleDataSelected.id_role)).then(checkedKeysRole => {
                this.nodes = nodes;                
                this.defaultCheckedKeys = checkedKeysRole;
                this.checkedKeys = checkedKeysRole;
                this.isLoading = false;
            });
        }); 

        this.submittedEditarRole =  true;
        this.isVisibleMostrarPermisos = true;
    }

    handleCancelMotrarPermisos(): void {  
    
        this.isVisibleMostrarPermisos = false;
        this.checkedKeys = [];

        this.submittedEditarRole = false;
        this.isLoading = true;
    }

    onSubmitMostrarPermisos(): void {

        this.submittedEditarRole = true;

        this.isConfirmLoading = false; 

        if(this.EditarRoleForm.invalid) {
            return;
        }

        let role = new Roles(
            this.roleDataSelected.id_role,
            this.EditarRoleForm.get('editarRole').value
        );        
               
        this.rolesServices.updatePermissions(role, this.checkedKeys)
        .subscribe(result => {
            
            this.rolesServices.getRoles().
            subscribe(roles => {
                this.roles = roles;                
                this.countRoles = Object.keys((__.countBy(this.roles, 'id_role'))).length; 
                this.isConfirmLoadingMostrarPermisos = false;
                this.isVisibleMostrarPermisos =  false;
                this.toastr.success('Permisos actualizados!');

                this.authenticationService.updatePermissions();
            }, err => {
                console.log(err);
            });
                 
        }, error => {
            this.isConfirmLoadingMostrarPermisos = false;
            this.toastr.error('Hubo un error al actualizar los permisos');
        })

        this.submittedEditarRole = false;
    }

    showModalAgregarModulo(data: any): void {
        this.roleDataSelected = JSON.parse(JSON.stringify(data)); 

        this.rolesServices.getTreeModules().then(nodes => {
            this.rolesServices.getCheckedKeysModules(Number(this.roleDataSelected.id_role)).then(checkedKeysRole => {
                this.nodes = nodes;
                this.defaultCheckedKeys = checkedKeysRole,
                this.checkedKeys = checkedKeysRole;
                this.isLoading = false;
            });
        }); 

        this.isVisibleAgregarModulo = true;
    }

    handleCancelAgregarModulo(): void {
        this.isVisibleAgregarModulo = false;
    }

    onSubmitAgregarModulos(): void {

        this.isConfirmLoadingAgregarModulo = true;

        let role = new Roles(
            this.roleDataSelected.id_role,
            null
        ); 

        this.rolesServices.addModule(role, this.checkedKeys)
        .subscribe(result => {
            
            this.rolesServices.getRoles().
            subscribe(roles => {
                this.roles = roles;
                this.countRoles = Object.keys((__.countBy(this.roles, 'id_role'))).length;
                this.isConfirmLoadingAgregarRole = false;

                if(Number(this.currentUser.id_role) === Number(this.roleDataSelected.id_role)) {

                    this.rolesServices.getModulos(Number(this.currentUser.id_role)).then(modules => { 
                        this.ngxrolesService.flushRoles();
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


                this.handleCancelAgregarModulo();
                this.toastr.success('Modulos modificados correctamente'); 
            }, err => {
                console.log(err);
            });
              
        }, err => {
            this.isConfirmLoadingAgregarModulo = false;
            this.toastr.error(err);  
        })

        this.submittedAgregarModulo =  false;
    }

    showDeleteConfirmRole(data: any): void {
        this.roleDataSelected = JSON.parse(JSON.stringify(data));
    
        this.rolesServices.countRoleUser(this.roleDataSelected.id_role)
        .subscribe(users=>{
            this.usuariosRole = users;
        }, err=>{
            console.log(err);
        })  

        this.modalService.confirm({
            nzTitle: '¿Esta seguro que desea eliminar el rol?',
            nzContent: `<ng-template>
                        <b style="color: red;">Se eliminara el rol de ${this.roleDataSelected.nombre_role}</b>
                        <br />`,
            nzOkText: 'Si',
            nzOkType: 'danger',
            nzOnOk: () => {
                this.rolesServices.deleteRole(this.roleDataSelected.id_role)
                .subscribe(result => {
                this.rolesServices.getRoles().
                    subscribe(roles => {
                        this.roles = roles;
                        this.countRoles = Object.keys((__.countBy(this.roles, 'id_role'))).length;
                        this.toastr.success('Rol eliminado exitosamente!'); 
                    }, err => {
                        console.log(err);
                    });
                    }, error => {
                        this.toastr.error('Este rol esta en uso');    
                    });
            },
            nzCancelText: 'No',
            nzOnCancel: () => {  
            }
        });
    }
    
}