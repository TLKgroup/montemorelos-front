import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { HomeService } from 'src/app/services/home.service';
import { Subscription, interval } from 'rxjs';
import { PanicService } from 'src/app/services/panic.service';
import Swal from 'sweetalert2';
import { lastPanic } from 'src/app/models/lastPanic';
import { ToastrService } from 'ngx-toastr';
import { PanicFilter } from 'src/app/models/panicFilter';
import { DatePipe } from '@angular/common';
import { VerificadoService } from 'src/app/services/verificado.service';
import { Verificado } from 'src/app/models/verificado';
import { Users } from 'src/app/models/users';
import { UsersService } from 'src/app/services/users.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  @ViewChild('map', { static: false }) gmapElement: ElementRef;
  map: google.maps.Map;

  @ViewChild('mapUsuario', { static: false }) gmapElementUsuario: ElementRef;
  mapUsuario: google.maps.Map;

  totalReporte;
  totalUsuario;
  totalPanic;
  totalPanicV;
  
  public panic: PanicFilter[] = [];

  public panicHistorial: PanicFilter[] = [];

  public alertas: PanicFilter[] = [];

  public lastpanic: lastPanic[] = [];

  public verificado: Verificado[] = []; 
  public usuario: Users[] = []; 

  public panicDataSelected: lastPanic;

  isVisibleViewPanicAlert : Boolean = false;

  private updateSubscription: Subscription;

  public verificadoDataSelected: Verificado;  
  public usuarioDataSelected: Users;  

  audio = new Audio('../../../assets/songs/alerta.wav');

  constructor(
    private verificadoService : VerificadoService,
    private usuariosService : UsersService,
    private reportService : ReportService, 
    private homeService : HomeService, 
    private toastr: ToastrService,
    private datepipe: DatePipe
  ) { 

    this.reportService.getReports().subscribe(result => {  
      this.totalReporte = result.length;
    }, error => {
      console.log(error);
    });
    
    // this.homeService.totalUsuarios().subscribe(result => {
    //   // this.totalUsuario = result.Total;
    // }, error => {
    //   console.log(error);
    // });

    this.usuariosService.getUsers().subscribe(request => {
      console.log(request);
      
      this.totalUsuario = request.length;
    },
      error => {
        console.log(error);
      }
    );

    this.homeService.getTotalPanic().subscribe(request => {
      this.totalPanicV = request.PanicTotal;
    },
    error => {
      console.log(error);
    })

    this.homeService.getPanicFilter().subscribe(request => {
      this.panic = request;
    },
    error => {
      console.log(error);
    })
  }

  ngOnInit() {
    this.updateSubscription = interval(8000).subscribe((val) => { 
      this.alerts();
    });
  }

  alerts() {
    this.homeService.getTotalPanic().subscribe(request => {
      this.totalPanic = request.PanicTotal;

      if(this.totalPanic > this.panic.length) {
        this.homeService.getLastPanic().subscribe(request => {
          this.lastpanic = [];
          this.lastpanic = request;
          this.reproducir();
          this.alerta();
        },
        error => {
          console.log(error);
        });

        this.homeService.getPanicFilter().subscribe(request => {
          this.panic = request;
        },
        error => {
          console.log(error);
        })
      }
    },
    error => {
      console.log(error);
    });
  }

  alerta() {
    this.lastpanic.forEach(ele => {
      this.panicDataSelected = ele;
    });

    this.usuariosService.getUsersW(this.panicDataSelected.uidUser).subscribe(request => {
      request.forEach(ele => {
        this.usuarioDataSelected = ele
      });

      console.log(this.usuarioDataSelected); 
    },
    error => {
      console.log(error);
    });

    this.verificadoService.getVerificadoW(this.panicDataSelected.uidUser).subscribe(request => {
      request.forEach(ele => {
        this.verificadoDataSelected = ele
      });

      console.log(this.verificadoDataSelected);   
    },
    error => {
      console.log(error);
    });  

    this.homeService.getPanicW(this.panicDataSelected.uidUser).subscribe(request => {
      this.panicHistorial = request;

      console.log(this.panicHistorial);   
    },
    error => {
      console.log(error);
    });  

    Swal.fire({
      title: this.panicDataSelected.nombre,
      text: "El usuario emitio una señal de alerta",
      icon: 'warning',
      iconColor: '#EC1E1E',
      confirmButtonColor: '#e75d1c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.onSubmitstatus(this.panicDataSelected.id_panic);
        this.showModalAlert(this.panicDataSelected, this.verificadoDataSelected, this.usuarioDataSelected);
        this.audio.pause();
      }
    });
  }

  onSubmitstatus(id: String) {
    let datos = {
      id: id,
      status: '1'
    }

    // this.homeService.updatestatus(datos).subscribe(result => {

    // }, error => {
    //   this.toastr.error('Hubo un error al actualizar el estado');
    // });
  }

  reproducir() {
    this.audio.play();
    this.audio.loop = true;
  }

  public mapaurl(): void{
    var urlmapa='https://www.google.com/maps/search/?api=1&query=' + this.panicDataSelected.latitude +','+this.panicDataSelected.longitude;
    window.open(urlmapa);
  }

  public mapaurlUsuario(): void{
    var urlmapa='https://www.google.com/maps/search/?api=1&query=' + 25.189112 + ',' + -99.826746;
    window.open(urlmapa);
  }
  
  initializeMap(latitude: number, longitud: number) {
    const lngLat = new google.maps.LatLng(latitude, longitud);
    const mapOptions: google.maps.MapOptions = {
      center: lngLat,
      zoom: 16,
      fullscreenControl: false,
      mapTypeControl: false,
      streetViewControl: false
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapOptions);

    let marker = new google.maps.Marker({
      position: new google.maps.LatLng(latitude, longitud),
      map: this.map,
      title: 'Ubicacion de la alerta',
      icon: '../../../assets/img/punto2.gif'
    });

    marker.setMap(this.map);
  }

  mapOfUser() {
    const lngLat = new google.maps.LatLng(25.189112, -99.826746);
    const mapOptions: google.maps.MapOptions = {
      center: lngLat,
      zoom: 16,
      fullscreenControl: false,
      mapTypeControl: false,
      streetViewControl: false
    };
    this.mapUsuario = new google.maps.Map(this.gmapElementUsuario.nativeElement, mapOptions);

    let marker = new google.maps.Marker({
      position: new google.maps.LatLng(25.189112, -99.826746),
      map: this.mapUsuario,
      title: 'Ubicacion del usuario'
    });

    marker.setMap(this.mapUsuario);
  }

  showModalAlert(data, veri, user): void {
    setTimeout(() => {      
      this.initializeMap(Number(data.latitude), Number(data.longitude));
      this.mapOfUser();
    }, 1000); 

    this.isVisibleViewPanicAlert = true;
  }

  handleCancelViewPanicAlert() {
    this.isVisibleViewPanicAlert = false;
  }
}
