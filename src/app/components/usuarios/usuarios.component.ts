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

  public userDataSelected: Users;
  public verificadoDataSelected: Verificado;

  isLoading: boolean = true;
  isVisibleDatosUsuario = false;

  isVisibleZoomImg: Boolean = false;
  zoom;

  constructor(
    private usuariosService : UsersService,
    private varificadoService : VerificadoService,
  ) { 

    this.usuariosService.getUsers().subscribe(request => {
      this.usuarios = request;
      this.isLoading = false;      
    },
    error => {
      console.log(error);
    });  

    this.varificadoService.getVerificado().subscribe(request => {
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

    let index = this.verificado.findIndex(value => {
			return this.userDataSelected.uidUser == String(value.uidUser);
    });
    
    if (index >= 0) {
      this.verificadoDataSelected = this.verificado[index];
		}
		else {

    }

    if (index >= 0) {
      this.userDataSelected = this.usuarios[index];
		}
		else {

    }

    console.log(this.verificadoDataSelected);
    console.log(this.userDataSelected);
    
    this.isVisibleDatosUsuario = true;
  }

  handleCancelDatosUsuario(): void {
    this.isVisibleDatosUsuario = false;
  }

  zoomImagen(imagen: string){
          
    switch (imagen) {

      case "a":
        this.zoom = this.verificadoDataSelected.ine;          
        console.log(this.zoom);
      break;
        
      case "b":
        this.zoom = this.verificadoDataSelected.ine2;
        console.log(this.zoom);
      break;

      case "c":
        this.zoom = this.verificadoDataSelected.domicilio;
        console.log(this.zoom);
      break;

      case "d":
        this.zoom = this.verificadoDataSelected.fachada;
        console.log(this.zoom);
      break;  
          
      case "e":
        this.zoom = this.verificadoDataSelected.selfie;
        console.log(this.zoom);
      break;   

    }

      this.isVisibleZoomImg= true;
  }


  handleCancelZoomImg(): void {
    this.isVisibleZoomImg = false;
  }

}
