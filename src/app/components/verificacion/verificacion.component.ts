import { Component, OnInit } from '@angular/core';
import { Verificado } from 'src/app/models/verificado';
import { VerificadoService } from 'src/app/services/verificado.service';
import { Users } from 'src/app/models/users';
import { UsersService } from 'src/app/services/users.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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

  public union: [] = []; 

  //isVisibleDatosVerificacion = false;

  verificadoEditarForm :FormGroup;

  isVisibleDatosVerificado: Boolean = false;
  


  submittedEditarVerificado =false;

  isConfirmLoadingEditarVerificado = false;


  isVisibleZoomImg: Boolean = false;
  zoom;
  
  
  constructor(
    private verificadoService : VerificadoService,
    private usuariosService : UsersService,
    
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
  ) {

    this.verificadoService.getVerificado().subscribe(request => {
      this.verificado = request.filter(obj => Number(obj.completado) == 0);
      console.log(this.verificado);
      this.isLoading = false;  
    },
    error => {
      console.log(error);
    });  

    this.usuariosService.getUsers().subscribe(request => {
      this.usuarios = request.filter(obj => Number(obj.verificado) == 0);  
      console.log(this.usuarios);
      this.isLoading = false; 
    },
    error => {
      console.log(error);
    }); 

  }

  ngOnInit() {
    this.verificadoEditarForm = this.formBuilder.group({
      completado: [''],
    });
  }

  get feu() { return this.verificadoEditarForm.controls; }

  showModalDatosVerificado(data: string): void {
    this.userDataSelected = JSON.parse(JSON.stringify(data));
    this.verificadoDataSelected = JSON.parse(JSON.stringify(data));

    this.verificadoEditarForm.controls['completado'].setValue(this.verificadoDataSelected.completado);
    

    let index = this.usuarios.findIndex(value => {
			return this.verificadoDataSelected.uidUser == String(value.uidUser);
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

    this.isVisibleDatosVerificado = true;
  }

  handleCancelDatosVerificado(): void {
    this.isVisibleDatosVerificado = false;

    //this.verificadoEditarForm.controls['completado'].setValue(this.verificadoDataSelected.completado);

    //this.submittedEditarVerificado = false;

    //console.log(this.verificadoDataSelected);
  }
  

  onSubmitEditarVerificado() {
    this.submittedEditarVerificado = true;

    this.isConfirmLoadingEditarVerificado = true;
   
    var idV = this.verificadoDataSelected.idV;
    var com = this.verificadoEditarForm.get('completado').value;
    var uidUser = this.verificadoDataSelected.uidUser;

    this.verificadoService.updateVerificado(idV, com, uidUser).subscribe(result => {      
      this.isConfirmLoadingEditarVerificado = false;
      this.isVisibleDatosVerificado = false;

      this.toastr.success('Verificación completada!');

      this.usuarios = [...this.usuarios];
      this.verificado = [...this.verificado];

    }, err => {
      console.log(err);
      this.isConfirmLoadingEditarVerificado = false;
      this.toastr.error('Hubo un error al verificar el usuario');
    })

    this.submittedEditarVerificado = false;
  }


  zoomImagen(imagen: string){
    
    //var imagen = "e";
    //this.verificadoDataSelected = JSON.parse(JSON.stringify(data));
      
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
