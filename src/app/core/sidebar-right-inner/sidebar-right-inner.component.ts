import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Categoria } from '../../models/categoria';
import { CategoriaService } from '../../services/categoria.service';

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

    public categorias: Categoria[];
    public role: Roles[] = [];

    public usuariosRole: User;

    public countCategorias;
    public countRoles;

    public roleDataSelected: Roles;

    roles: Roles;

    categoriaEditarForm: FormGroup;
    categoriaAgregarForm: FormGroup;

    AgregarRoleForm: FormGroup;
    EditarRoleForm: FormGroup;
    

    isVisibleAgregarRole = false;
    isConfirmLoadingAgregarRole = false;

    isVisibleAgregarModulo = false;
    isConfirmLoadingAgregarModulo = false;

    isVisibleMostrarPermisos = false;
    isConfirmLoadingMostrarPermisos = false;

    isVisibleAgregarCategoria = false;
    isConfirmLoadingAgregarCategoria = false;

    isVisibleEditarCategoria = false;
    isConfirmLoadingEditarCategoria = false;

    submittedAgregarRole = false;
    submittedEditarRole = false;

    submittedAgregarModulo = false;

    submittedAgregarCategoria = false;
    submittedEditarCategoria = false;

    public categoriaDataSelected: Categoria;

    constructor(
        public categoriaService: CategoriaService,
        private modalService: NzModalService,
        private toastr: ToastrService,
        private formBuilder: FormBuilder,
        private rolesServices: RolesService,
        private authenticationService: AuthentificationService,
        private layoutStore: LayoutStore,
        private ngxrolesService: NgxRolesService
    ) {
        this.categoriaService.getCategoria()
        .subscribe(data => { 
            this.categorias = data;
            this.countCategorias = Object.keys((__.countBy(this.categorias))).length;          
        }, err => {
            console.log(err);
        });
        this.currentUser = this.authenticationService.currentUserValue;
     }

    ngOnInit() {        

        this.categoriaAgregarForm = this.formBuilder.group({
            agregarCategoria: ['', Validators.required]
        });

        this.categoriaEditarForm = this.formBuilder.group({
            editarCategoria: ['', Validators.required]
        });

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

    get acf() { return this.categoriaAgregarForm.controls; }
    get ecf() { return this.categoriaEditarForm.controls; }

    get arf() { return this.AgregarRoleForm.controls; }
    get erf() { return this.EditarRoleForm.controls; }

    ngOnDestroy() {
 
    }

    showModalAgregarCategoria(): void {    
        this.isVisibleAgregarCategoria = true;
    }

    handleCancelAgregarCategoria(): void {
        this.isVisibleAgregarCategoria = false;   
        this.submittedAgregarCategoria = false;
    }

    onSubmitAgregarCategoria(){

        this.submittedAgregarCategoria = true;

        if(this.categoriaAgregarForm.invalid) {
            return;
        }

        this. isConfirmLoadingAgregarCategoria = true;

        let categoria = new Categoria(
            null,
            this.categoriaAgregarForm.get('agregarCategoria').value
        ); 
                
        this.categoriaService.addCategoria(categoria)
        .subscribe(result => {
            
            this.categorias.push(new Categoria(
                result.Categoria.id_categoria,
                result.Categoria.nombre_categoria
            ));

            this.categorias = [...this.categorias];
            this.countCategorias = Object.keys((__.countBy(this.categorias))).length;   

            this. isConfirmLoadingAgregarCategoria = false;
            this.handleCancelAgregarCategoria();
            this.toastr.success('Categoria Agregada!');  

        }, err => {
            console.log(err);
            this. isConfirmLoadingAgregarCategoria = false;
            this.toastr.error('Hubo un error al agregar la categoria');       
        })
        
        this.submittedAgregarCategoria = false;
    }

    showModalEditarCategoria(categoria: Categoria): void {
        this.categoriaDataSelected = JSON.parse(JSON.stringify(categoria));
        this.isVisibleEditarCategoria = true;
        this.categoriaEditarForm.controls['editarCategoria'].setValue(String(this.categoriaDataSelected.nombre_categoria));
    }

    handleCancelEditarCategoria(): void {
        this.isVisibleEditarCategoria = false;      
        this.submittedEditarCategoria = false;
    }

    onSubmitEditarCategoria(){
        this.submittedEditarCategoria = true;

        if(this.categoriaEditarForm.invalid) {
            return;
        }

        this. isConfirmLoadingEditarCategoria = true;

        let categoria = new Categoria(
            this.categoriaDataSelected.id_categoria,
            this.categoriaEditarForm.get('editarCategoria').value
        );        
               
        this.categoriaService.updateCategoria(categoria)
        .subscribe(result => {
         
            this.categoriaService.getCategoria()
            .subscribe(data => {
                this.categorias = data;
                this.countCategorias = Object.keys((__.countBy(this.categorias))).length;   
            }, err => {
                console.log(err);
            });

            this. isConfirmLoadingEditarCategoria = false;
            this.isVisibleEditarCategoria =  false;
            this.toastr.success('Categoria actualizado!');     

        }, error => {
            
            this. isConfirmLoadingEditarCategoria = false;
            this.toastr.error('Hubo un error al actualizar la categoria');
        })

        this.submittedEditarCategoria = false;
    }

    showDeleteConfirmCategoria(categoria: Categoria): void {
        this.categoriaDataSelected = JSON.parse(JSON.stringify(categoria));
        this.modalService.confirm({
            nzTitle: '¿Esta seguro que desea eliminar la categoria?',
            nzContent: '<b style="color: red;">Se eliminara la categoria ' + this.categoriaDataSelected.nombre_categoria + '</b>',
            nzOkText: 'SI',
            nzOkType: 'danger',
            nzOnOk: () => {
                this.categoriaService.deleteCategoria(this.categoriaDataSelected.id_categoria)
                .subscribe(result => {
                    this.toastr.success('Categoria eliminada correctamente!'); 
                    this.categorias = this.categorias.filter(obj => obj.id_categoria !== this.categoriaDataSelected.id_categoria);
                    this.categorias = [...this.categorias];
                    this.countCategorias = Object.keys((__.countBy(this.categorias))).length;   
                }, error => {
                    this.toastr.error('Hubo un error al eliminar la categoria');    
                });
            },
            nzCancelText: 'No',
            nzOnCancel: () => {
                
            }
        });
    }
        
    showModalAgregarRole(): void {

        this.isVisibleAgregarRole = true;

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