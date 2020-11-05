import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Report } from '../models/reports';


@Injectable({
  providedIn: 'root'
})
export class HomeService {
  
  observable:Observable<Report[]>;  
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
                    item.data.dependencia,
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

  totalUsuarios() {
        
    return this.http.get<any>(`${environment.url_api}usuarios/count/totales`)
    .pipe(
        map(data => {  
            return data;
        })
    );
  }
}
