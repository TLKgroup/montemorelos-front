import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {} from 'googlemaps';
import { Panic } from 'src/app/models/panic';
import { PanicService } from 'src/app/services/panic.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-panic',
  templateUrl: './panic.component.html',
  styleUrls: ['./panic.component.css']
})
export class PanicComponent implements OnInit {

  @ViewChild('map', { static: false }) gmapElement: ElementRef;
  map: google.maps.Map;

  public panic: Panic[] = [];

  public panicDataSelected: Panic;

  isLoading: boolean = true;

  isVisiblePanic = false;

  private updateSubscription: Subscription;

  constructor(
    private panicService : PanicService,
    private formBuilder: FormBuilder,
  ) {

    this.panicService.getPanic() .subscribe(request => {

      this.panic = request;

      console.log(this.panic);
      this.isLoading = false;      
    },
    error => {
      console.log(error);
    });  
  }

  ngOnInit() {
    this.updateSubscription = interval(12000).subscribe(
      (val) => { 
        this.panicService.getPanic() .subscribe(request => {

          this.panic = request;  
        },
        error => {
          console.log(error);
        });
      }
    );
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
      title: 'Ubicacion del Reporte'
    });

    marker.setMap(this.map);
  }

  
  showModalPanic(data: string): void {
    this.panicDataSelected = JSON.parse(JSON.stringify(data));
    setTimeout(() => {      
      this.initializeMap(Number(this.panicDataSelected.latitude), Number(this.panicDataSelected.longitude));
    }, 1000);  
    this.isVisiblePanic = true;

  }

  handleCancelPanic(): void {
    this.isVisiblePanic = false;
  }

}
