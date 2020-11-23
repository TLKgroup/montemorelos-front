import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { HomeService } from 'src/app/services/home.service';
import { Subscription, interval } from 'rxjs';
import { PanicService } from 'src/app/services/panic.service';
import Swal from 'sweetalert2';
import { lastPanic } from 'src/app/models/lastPanic';
import { ToastrService } from 'ngx-toastr';
import { PanicFilter } from 'src/app/models/panicFilter';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  @ViewChild('map', { static: false }) gmapElement: ElementRef;
  map: google.maps.Map;

  totalReporte;
  totalUsuario;
  totalPanic;
  
  public panic: PanicFilter[] = [];

  public alertas: PanicFilter[] = [];

  public lastpanic: lastPanic[] = []; 

  public panicDataSelected: lastPanic;

  isVisibleViewPanicAlert : Boolean = false;

  private updateSubscription: Subscription;

  constructor(
    private reportService : ReportService, 
    private homeService : HomeService, 
    private toastr: ToastrService,
  ) { 

    this.reportService.getReports().subscribe(result => {  
      this.totalReporte = result.length;
    }, error => {
      console.log(error);
    });
    
    this.homeService.totalUsuarios().subscribe(result => {
      this.totalUsuario = result.Total;
    }, error => {
      console.log(error);
    });

    this.homeService.getPanicFilter().subscribe(request => {
      this.panic = request;
      console.log(this.panic);
    },
    error => {
      console.log(error);
    })
  }

  ngOnInit() {
    this.updateSubscription = interval(11000).subscribe((val) => { 
      this.alerts()
    });
  }

  alerts() {
    this.homeService.getTotalPanic().subscribe(request => {
      this.totalPanic = request.PanicTotal;

      console.log(this.panic.length);
      console.log(this.totalPanic);

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

    Swal.fire({
      title: this.panicDataSelected.nombre,
      text: "You won't be able to revert this!",
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.onSubmitstatus(this.panicDataSelected.id_panic);
        this.showModalAlert(this.panicDataSelected);
      }
    });
  }

  onSubmitstatus(id: String) {
    let datos = {
      id: id,
      status: '1'
    }

    this.homeService.updatestatus(datos).subscribe(result => {

    }, error => {
      this.toastr.error('Hubo un error al actualizar el estado');
    });
  }

  reproducir() {
    const audio = new Audio('../../../assets/songs/alerta.wav');
    audio.play();
  }

  public mapaurl(): void{
    var urlmapa='https://www.google.com/maps/search/?api=1&query=' + this.panicDataSelected.latitude +','+this.panicDataSelected.longitude;
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
      title: 'Ubicacion de la alerta'
    });

    marker.setMap(this.map);
  }

  showModalAlert(data): void {
    setTimeout(() => {      
      this.initializeMap(Number(data.latitude), Number(data.longitude));
    }, 1000);  

    this.isVisibleViewPanicAlert = true;
  }

  handleCancelViewPanicAlert() {
    this.isVisibleViewPanicAlert = false;
  }

}
