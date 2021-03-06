import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {} from 'googlemaps';
import { Panic } from 'src/app/models/panic';
import { PanicService } from 'src/app/services/panic.service';
import { interval, Subscription } from 'rxjs';
import { VerificadoService } from 'src/app/services/verificado.service';
import { Verificado } from 'src/app/models/verificado';

@Component({
  selector: 'app-panic',
  templateUrl: './panic.component.html',
  styleUrls: ['./panic.component.css']
})
export class PanicComponent implements OnInit {

  @ViewChild('map', { static: false }) gmapElement: ElementRef;
  map: google.maps.Map;
  disabled;

  public panic: Panic[] = [];
  public verificado: Verificado[] = [];
  public panicDataSelected: Panic;
  public verificadoDataSelected: Verificado;

  isLoading: boolean = true;
   center;

  isVisiblePanic = false;
  private updateSubscription: Subscription;


  isVisibleZoomImg: Boolean = false;
  zoom;


  constructor(
    private panicService : PanicService,
    private varificadoService : VerificadoService,
  ) {

    this.panicService.getPanicFilter() .subscribe(request => {
      this.panic = request;
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
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
    });
  }

  initializeMap(latitude: number, longitud: number) {
    const lngLat = new google.maps.LatLng(latitude, longitud);
    const mapOptions: google.maps.MapOptions = {
      center: lngLat,
      zoom: 16,
      fullscreenControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      zoomControl: false,
      scrollwheel: false,
      disableDoubleClickZoom: true,
      mapTypeId: 'hybrid'
    };

    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapOptions);

    let marker = new google.maps.Marker({
      position: new google.maps.LatLng(latitude, longitud),
      map: this.map,
      title: 'Ubicacion del Reporte',
    });

    marker.setMap(this.map);
  }
  
  showModalPanic(data: string): void {
    this.panicDataSelected = JSON.parse(JSON.stringify(data));
    this.verificadoDataSelected = JSON.parse(JSON.stringify(data));
    

    console.log(data);
    console.log(this.panicDataSelected);

    setTimeout(() => {      
     this.initializeMap(Number(this.panicDataSelected.latitude), Number(this.panicDataSelected.longitude));
    }, 1000);  
    this.isVisiblePanic = true;

    let index = this.verificado.findIndex(value => {
			return this.verificadoDataSelected.uidUser == String(value.uidUser);
    });
    
    if (index >= 0) {
      this.panicDataSelected = this.panic[index];
    }

    if (index >= 0) {
      this.verificadoDataSelected = this.verificado[index];
    }
  }

  public mapaurl(){
    var urlmapa='https://www.google.com/maps/search/?api=1&query=' + this.panicDataSelected.latitude +','+this.panicDataSelected.longitude;
    window.open(urlmapa);
  }

  handleCancelPanic(): void {
    this.isVisiblePanic = false;
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
        this.zoom = this.verificadoDataSelected.colonia;
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