import { Component, OnInit } from '@angular/core';
import { Verificado } from 'src/app/models/verificado';
import { VerificadoService } from 'src/app/services/verificado.service';
import { Users } from 'src/app/models/users';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-verificacion',
  templateUrl: './verificacion.component.html',
  styleUrls: ['./verificacion.component.css']
})
export class VerificacionComponent implements OnInit {

  public verificado: Verificado[] = [];
  public usuarios: Users[] = [];

  isLoading: boolean = true;

  public userDataSelected: Users;
  public verificadoDataSelected: Verificado;

  isVisibleDatosVerificacion = false;
  
  constructor(
    private varificadoService : VerificadoService,
    private usuariosService : UsersService,
  ) {
    this.varificadoService.getVerificado().subscribe(request => {

      this.verificado = request.filter(obj => Number(obj.completado) == 1);
      console.log(request);
      this.isLoading = false;  
    },
    error => {
      console.log(error);
    });  

    this.usuariosService.getUsers() .subscribe(request => {

      this.usuarios = request;    
    },
    error => {
      console.log(error);
    });  
  }

  ngOnInit() {

  }

  showModalDatosVerificado(data: string): void {
    this.userDataSelected = JSON.parse(JSON.stringify(data));
    this.isVisibleDatosVerificacion = true;

    let index = this.verificado.findIndex(value => {
			return this.userDataSelected.uidUser == String(value.uidUser);
    });
    
    if (index >= 0) {
      this.verificadoDataSelected = this.verificado[index];
		}
		else {

    }
  }

  handleCancelDatosVerificado(): void {
    this.isVisibleDatosVerificacion = false;
  }

}
