import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { VerificadoService } from 'src/app/services/verificado.service';
import { Users } from 'src/app/models/users';
import { Verificado } from 'src/app/models/verificado';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  public usuarios: Users[] = [];
  public verificado: Verificado[] = [];

  isLoading: boolean = true;

  isVisibleDatosUsuario = false;

  public userDataSelected: Users;
  public verificadoDataSelected: Verificado;

  constructor(
    private usuariosService : UsersService,
    private varificadoService : VerificadoService,
  ) { 

    this.usuariosService.getUsers() .subscribe(request => {

      this.usuarios = request;
      this.isLoading = false;      
    },
    error => {
      console.log(error);
    });  

    this.varificadoService.getVerificado() .subscribe(request => {

      this.verificado = request;
    },
    error => {
      console.log(error);
    });  

  }

  ngOnInit() {

  }

  showModalDatosUsuario(data: string): void {
    this.userDataSelected = JSON.parse(JSON.stringify(data));
    this.verificadoDataSelected = JSON.parse(JSON.stringify(data));

    this.isVisibleDatosUsuario = true;

    let index = this.verificado.findIndex(value => {
			return this.userDataSelected.uidUser == String(value.uidUser);
    });
    
    if (index >= 0) {
      this.verificadoDataSelected = this.verificado[index];
		}
		else {

    }
  }

  handleCancelDatosUsuario(): void {
    this.isVisibleDatosUsuario = false;

    this.userDataSelected = null;
    this.verificadoDataSelected = null;
  }

}
