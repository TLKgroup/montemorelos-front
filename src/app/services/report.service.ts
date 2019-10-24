import { Injectable } from '@angular/core';


import { Report } from '../models/reports';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  observable:Observable<Report[]>;  
  public currentUser;
  public urlAPI;

  constructor(private http: HttpClient) {
     
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
                    item.data.latitude,
                    item.data.longitude,
                    item.data.urlImage1,
                    item.data.urlImage2,
                    item.data.urlImage3,
                    item.data.urlVideo,
                    item.data.status
                );
            });
        })
    );
  }
}