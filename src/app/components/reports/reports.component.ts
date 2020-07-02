import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { Report } from 'src/app/models/reports';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {} from 'googlemaps';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  @ViewChild('map', { static: false }) gmapElement: ElementRef;
  map: google.maps.Map;

  public reports: Report[] = [];

  /* Modal Variables */
  isVisibleViewReport: Boolean = false;

  /* Forms */
  userViewReport: FormGroup;
  
  /* isLoading */
  isLoading: boolean = true;
  isLoadingConfirmViewReport: Boolean = false;

  public reportDataSelected: Report;  

  public status;
  public date;
  public fecha;

  /* Timeline */
  alternate: boolean = true;
  toggle: boolean = true;
  color: string = 'primary';
  size: number = 45;
  expandEnabled: boolean = true;
  side = 'right';  

  selectedValue = null;

  constructor(
    private reportService : ReportService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
  ) {
    
  }
  
  ngOnInit() {

    this.userViewReport = this.formBuilder.group({
      statusSelect: [''],
    });

    this.fecha = Date();
    this.date = { year: 'numeric', month: 'long', day: 'numeric' };


    this.reportService.getReports()
    .subscribe(request => {
      this.reports = request;

      console.log(request.filter(obj => Number(obj.status) >= 1));
      console.log(request.filter(obj => Number(obj.status) >= 2));
      console.log(request.filter(obj => Number(obj.status) >= 3));

      console.log(request.length);
      this.isLoading = false;      
    },
      error => {
        console.log(error);
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

  showModalVerReporte(data: any) {
    this.reportDataSelected = JSON.parse(JSON.stringify(data));
    this.isVisibleViewReport = true;
    
    setTimeout(() => {      
      this.initializeMap(Number(this.reportDataSelected.latitude), Number(this.reportDataSelected.longitude));
    }, 1000);    
  }

  handleCancelViewReport() {
    this.isVisibleViewReport = false;
  }

  onChangeStatus(value) {
    if(value) {
      this.status = value;
      console.log(this.status);
    }
  }

  onSubmitVerReporte() {
    this.isVisibleViewReport = false;
  }

}
