import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { Report } from 'src/app/models/reports';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {} from 'googlemaps';

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
  isVisibleModalView: Boolean = false;

  /* Forms */
  userViewReport: FormGroup;
  
  /* isLoading */
  isLoading: boolean = true;
  isLoadingConfirmViewReport: Boolean = false;

  public reportDataSelected: Report;  

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
  ) {
  }
  
  ngOnInit() {

    this.userViewReport = this.formBuilder.group({

    });

    this.reportService.getReports()
    .subscribe(request => {
      this.reports = request;
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
    this.isVisibleModalView = true;
    setTimeout(() => {      
      this.initializeMap(Number(this.reportDataSelected.latitude), Number(this.reportDataSelected.longitude));
    }, 1000);    
  }

  onSubmitVerReporte() {
    this.isVisibleModalView = false;
  }

  handleCancelVerReporte() {
    this.isVisibleModalView = false;
  }

  entries = [
    {
      header: 'Creacion...',
      content: 'Revisando cada uno de los reportes'
    },
    {
      header: 'En proceso...',
      content: 'Revisando cada uno de los reportes'
    },
    {
      header: 'Raalizado',
      content: 'Revisando cada uno de los reportes'
    }
  ]

  addEntry() {
    this.entries.push({
      header: 'header',
      content: 'content'
    })
  }

  removeEntry() {
    this.entries.pop();
  }
    
  onHeaderClick(event) {
    if (!this.expandEnabled) {
      event.stopPropagation();
    }
  }

  onDotClick(event) {
    if (!this.expandEnabled) {
      event.stopPropagation();
    }
  }
  
}
