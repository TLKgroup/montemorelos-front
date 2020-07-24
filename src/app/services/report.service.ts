import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Socket } from 'ngx-socket-io';
import * as moment from 'moment';
import { Report } from '../models/reports';
import { Status } from '../models/status';


moment.locale('en');

@Injectable({
  providedIn: 'root'
})

export class ReportService {

  observable:Observable<Report[]>;  

  constructor(
    private http: HttpClient, 
    private socket: Socket
  ) {
     
  }
  
  getReports(): Observable<Report[]> {
    return this.http.get<any>(`${environment.url_api}reportes`)
    .pipe(
      map(result => {
        return JSON.parse(JSON.stringify(result.Reportes)).map(item => {                
          return new Report(
            item.id,
            item.data.uidUser,
            item.data.type,
            item.data.description,
            item.data.colony,
            item.data.createAt,
            item.data.latitude,
            item.data.longitude,
            item.data.urlImage1,
            item.data.urlImage2,
            item.data.urlImage3,
            item.data.urlVideo,
            item.data.status,
            item.data.modificactionAt
          );
        });
      })
    );
  }

  getReportS(): Observable<Report[]> {
    return this.observable = new Observable((observer)=>{
      this.socket.on('SHOW_REPORTS', (data) => { 
        let request = JSON.parse(JSON.stringify(data.Reportes)).map(item => {                                            
          return new Report(
            item.id,
            item.data.uidUser,
            item.data.type,
            item.data.description,
            item.data.colony,
            item.data.createAt,
            item.data.latitude,
            item.data.longitude,
            item.data.urlImage1,
            item.data.urlImage2,
            item.data.urlImage3,
            item.data.urlVideo,
            item.data.status,
            item.data.modificactionAt
          );
        })
        observer.next(request);
      });
    }) 
  }

  changeStatus(stat: Status) {
    let data = {
      id: stat.id_report,
      status: stat.status,
      modificationAt: stat.fecha,
    }

    return this.http.put<any>(`${environment.url_api}setstatus`, data)
    .pipe(
      map(result => {
        return result;
      })
    );
  }
}