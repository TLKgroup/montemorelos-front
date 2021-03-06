import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { Report } from 'src/app/models/reports';
import { FormGroup, FormBuilder } from '@angular/forms';
import {} from 'googlemaps';
import { Status } from 'src/app/models/status';
import { ToastrService } from 'ngx-toastr';
import { Observable, interval, Subscription } from 'rxjs';
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
  public reportsBackup: Report[] = [];
  public reportsProcess: Report[] = [];
  public reportsFinish: Report[] = [];

  isVisibleViewReport: Boolean = false;
  isVisibleReportProcess: Boolean = false;
  isVisibleViewReportProcess: Boolean = false;

  isVisibleReportFinish: Boolean = false;
  isVisibleViewReportFinish: Boolean = false;

  userViewReport: FormGroup;
  userViewReportProcess: FormGroup;
  
  isLoading: boolean = true;
  
  searchValueDependecia = '';

  public reportDataSelected: Report;  
  public reportDataSelectedProcess: Report;  
  public reportDataSelectedFinish: Report;  

  public status;
  public format;
  public fecha;

  private updateSubscription: Subscription;

  constructor(
    private reportService : ReportService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private datepipe: DatePipe,
  ) {
    
  }
  
  ngOnInit() {

    this.fecha = new Date();
    this.format = { year: 'numeric', month: 'long', day: 'numeric' };

    this.userViewReport = this.formBuilder.group({
      statusSelect: [''],
    });

    this.userViewReportProcess = this.formBuilder.group({
      statusSelect: [''],
    });


    this.updateSubscription = interval(100000).subscribe((val) => { 
      this.reportService.getReports() .subscribe(request => {
        var val = request.filter(obj => Number(obj.status) == 1) 
        this.reports = val.sort((a,b) => 0 - (a > b ? -1 : 1))
      },
      error => {
        console.log(error);
      });  
    });

    this.reportService.getReports() .subscribe(request => {

      var valor1 = request.filter(obj => Number(obj.status) == 1);   
      var valor2 = request.filter(obj => Number(obj.status) == 1);   
      var valor3 =  request.filter(obj => Number(obj.status) == 2);
      var valor4 = request.filter(obj => Number(obj.status) == 3);   

      this.reports = valor1.sort((a,b) => 0 - (a > b ? -1 : 1));
      this.reportsBackup = valor2.sort((a,b) => 0 - (a > b ? -1 : 1));
      this.reportsProcess =  valor3.sort((a,b) => 0 - (a > b ? -1 : 1));
      this.reportsFinish = valor4.sort((a,b) => 0 - (a > b ? -1 : 1));   

      console.log(this.reports);
    
      this.isLoading = false;      
    },
    error => {
      console.log(error);
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
    
    this.userViewReport.get('statusSelect').setValue(null);
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

  onSubmitstatus() {

    let stat = new Status(
      this.reportDataSelected.id_report,
      this.status,
      this.fecha.toLocaleDateString("es-ES", this.format)
    );

    this.reportService.changeStatus(stat).subscribe(result => {

      this.reportService.getReports() .subscribe(request => {
        this.reports = request.filter(obj => Number(obj.status) == 1);   
      },
      error => {
        console.log(error);
      });  

      this.toastr.success('Estado actualizado!');
    }, error => {
      this.toastr.error('Hubo un error al actualizar el estado');
    })
  }

  showModalReportProcess() {
    this.isVisibleReportProcess = true;
  }

  handleCancelReportProcess() {
    this.isVisibleReportProcess = false;
  }

  showModalViewReportProcess(data: any) {
    this.reportDataSelectedProcess = JSON.parse(JSON.stringify(data));
    this.isVisibleViewReportProcess = true;

    setTimeout(() => {      
      this.initializeMap(Number(this.reportDataSelectedProcess.latitude), Number(this.reportDataSelectedProcess.longitude));
    }, 1000);  

    this.userViewReportProcess.get('statusSelect').setValue(null);
  }

  handleCancelViewReportProcess() {
    this.isVisibleViewReportProcess = false;
  }

  showModalReportFinish(data: any) {
    this.isVisibleReportFinish = true;
  }

  handleCancelReportFinish() {
    this.isVisibleReportFinish = false;
  }
  
  showModalViewReportFinish(data: any) {
    this.reportDataSelectedFinish = JSON.parse(JSON.stringify(data));
    this.isVisibleViewReportFinish = true;

    setTimeout(() => {      
      this.initializeMap(Number(this.reportDataSelectedFinish.latitude), Number(this.reportDataSelectedFinish.longitude));
    }, 1000);  
  }

  handleCancelViewReportFinish() {
    this.isVisibleViewReportFinish = false;
  }

  public mapaurl(){
    var urlmapa='https://www.google.com/maps/search/?api=1&query=' + this.reportDataSelected.latitude +','+this.reportDataSelected.longitude;
    window.open(urlmapa);
  }




  searchDependecia(): void {
    this.reports = this.transform(this.reports, this.searchValueDependecia, 'dependencia');
  }

  resetDependecia(): void{
    this.reports = this.reportsBackup;
    this.searchValueDependecia = '';
  }

  transform(itemList: any[], searchKeyword: string, nombre_columna: string)  {
    if (!itemList)
      return [];
    if (!searchKeyword)
      return itemList;
    let filteredList = [];
    if (itemList.length > 0) {
      searchKeyword = searchKeyword.toLowerCase();
      itemList.forEach(item => {      

        let columna = item[nombre_columna].toString();          
    
        for(let i=0;i<columna.length;i++) {                
          if (columna) {
            if (columna.toString().toLowerCase().indexOf(searchKeyword) > -1) {
              filteredList.push(item);
              break;
            }
          }
        }
            
      });
    }

    return filteredList;
  }

}