import { Component, OnInit } from '@angular/core';

import { NzModalService } from 'ng-zorro-antd';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NzFormatEmitEvent } from 'ng-zorro-antd';
import { NgxPermissionsService } from 'ngx-permissions';


import { UserService } from '../../services/user.service';
import { RolesService } from '../../services/roles.service';
import { User } from '../../models/user';
import { Roles } from 'src/app/models/role';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {


    nzEvent(event: NzFormatEmitEvent): void {
        console.log(event);
    }

    isLoading: boolean = true;

    searchValue = '';

    public users: User[] = [];
    public user: User;


    public userDataSelected: User;

    passwordVisible = false;
    password: string;

    roles: Roles;

    rolesPermisos: Roles;

    userAgregarForm: FormGroup;

    submittedAgregarUsuario = false;

    isVisibleAgregarUsuario = false;
    isConfirmLoadingAgregarUsuario = false;

    isVisibleRoles = false;
    isConfirmLoadingRoles = false;

    userEditarForm: FormGroup;

    submittedEditarUsuario = false;

    isVisibleEditarUsuario = false;
    isConfirmLoadingEditarUsuario = false;

    constructor(
        private userService: UserService,
        private permissionsService: NgxPermissionsService,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private modalService: NzModalService,
        private rolesServices: RolesService
    ) {

        this.userService.getUsers()
        .subscribe(request => {
            this.users = request;
            this.isLoading = false;
        },
            error => {
                console.log(error);
            }
        );

        this.rolesServices.getRoles().
        subscribe(roles => {
            this.roles = roles;            
        }, err => {
            console.log(err);
        });

    }

    ngOnInit() {
        this.userAgregarForm = this.formBuilder.group({
            nombre_empleado: ['', Validators.required],
            nombre_usuario: ['', Validators.required],
            contrasena: ['', Validators.required],
            rol: ['', Validators.required]
        });

        this.userEditarForm = this.formBuilder.group({
            nombre_empleado: ['', Validators.required],
            nombre_usuario: ['', Validators.required],
            contrasena: [''],
            rol: ['', Validators.required]
        });
    }

    get fau() { return this.userAgregarForm.controls; }
    get feu() { return this.userEditarForm.controls; }

    showModalAgregarUsuario(): void {
        this.isVisibleAgregarUsuario = true;

        this.userAgregarForm.get('nombre_empleado').setValue(null);
        this.userAgregarForm.get('nombre_usuario').setValue(null);
        this.userAgregarForm.get('rol').setValue(null);
        this.password = null;
    }

    handleCancelAgregarUsuario(): void {
        this.isVisibleAgregarUsuario = false;
        this.submittedAgregarUsuario = false;
    }

    onSubmitAgregarUsuario() {
        this.submittedAgregarUsuario = true;

        if (this.userAgregarForm.invalid) {
            return;
        }

        this.isConfirmLoadingAgregarUsuario = true;

        let user = new User(
            null,
            this.userAgregarForm.get('nombre_empleado').value,
            this.userAgregarForm.get('nombre_usuario').value,
            this.userAgregarForm.get('contrasena').value,
            this.userAgregarForm.get('rol').value
        );

        this.userService.addUser(user)
            .subscribe(result => {
                console.log(result);

                let role = Object.values(this.roles).find(value =>{
                    return value.id_role == result.id_role
                        
                });

                this.users.push(new User(
                    result.id_usuario,
                    result.nombre_empleado,
                    result.nombre_usuario,
                    result.contrasena,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    role.nombre_role
                ));

                this.users = [...this.users];

                this.isConfirmLoadingAgregarUsuario = false;
                this.isVisibleAgregarUsuario = false;
                this.toastr.success('Usuario Agregado!');

            }, err => {
                this.isConfirmLoadingAgregarUsuario = false;

                if (err.error.msg.error.fields) {
                    if (err.error.msg.error.fields.nombre_usuario)
                        this.toastr.error('El nombre de usuario ingresado ya existe.');
                } else {
                    this.toastr.error('Hubo un error al agregar el usuario');
                }
            })
        this.submittedAgregarUsuario = false;
    }

    showModalEditarUsuario(data: string): void {
        this.userDataSelected = JSON.parse(JSON.stringify(data));

        console.log(this.userDataSelected);
        this.userEditarForm.controls['nombre_empleado'].setValue(this.userDataSelected.nombre_empleado);
        this.userEditarForm.controls['nombre_usuario'].setValue(this.userDataSelected.nombre_usuario);
        this.userEditarForm.controls['contrasena'].setValue(this.userDataSelected.contrasena);
        this.userEditarForm.controls['rol'].setValue(String(this.userDataSelected.id_role));
        this.isVisibleEditarUsuario = true;
    }

    handleCancelEditarUsuario(): void {
        this.isVisibleEditarUsuario = false;
        this.submittedEditarUsuario = false;
    }

    onSubmitEditarUsuario() {
        this.submittedEditarUsuario = true;

        if (this.userEditarForm.invalid) {
            return;
        }

        this.isConfirmLoadingEditarUsuario = true;

        let user = new User(
            this.userDataSelected.id_usuario,
            this.userEditarForm.get('nombre_empleado').value,
            this.userEditarForm.get('nombre_usuario').value,
            this.userEditarForm.get('contrasena').value,
            this.userEditarForm.get('rol').value
        );

        this.userService.updateUsers(user)
            .subscribe(result => {
                this.isConfirmLoadingEditarUsuario = false;
                this.isVisibleEditarUsuario = false;
                this.toastr.success('Usuario actualizado!');

                this.userService.getUsers()
                    .subscribe(request => {
                        this.users = request;
                        this.isLoading = false;
                    },
                        error => {
                            console.log(error);
                        }
                    );

            }, err => {
                console.log(err);
                this.isConfirmLoadingEditarUsuario = false;

                if (err.error.msg.error.fields) {
                    if (err.error.msg.error.fields.nombre_usuario)
                        this.toastr.error('El nombre de usuario ingresado ya existe.');
                } else {
                    this.toastr.error('Hubo un error al editar el usuario');
                }
            })

        this.submittedEditarUsuario = false;
    }

    showDeleteConfirm(data: string): void {
        this.userDataSelected = JSON.parse(JSON.stringify(data));
        this.modalService.confirm({
            nzTitle: '¿Esta seguro que desea eliminar el usuario?',
            nzContent: '<b style="color: red;">Se eliminara el usuario: ' + this.userDataSelected.nombre_empleado + '</b>',
            nzOkText: 'Si',
            nzOkType: 'danger',
            nzOnOk: () => {
                this.userService.deleteUser(this.userDataSelected.id_usuario)
                    .subscribe(result => {
                        this.toastr.success('Usuario eliminado correctamente!');

                        this.users = this.users.filter(obj => obj.id_usuario !== this.userDataSelected.id_usuario);
                        this.users = [...this.users];
                    }, error => {
                        this.toastr.error('Hubo un error al eliminar el usuario');
                    });
            },
            nzCancelText: 'No',
            nzOnCancel: () => {
            }
        });
    }
}
