import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { Panic } from '../models/panic';

moment.locale('en');

@Injectable({
  providedIn: 'root'
})

export class PanicService {

    observable:Observable<Panic[]>;  

    constructor(
        private http: HttpClient
    ) {
        
    }
  
    getPanic(): Observable<Panic[]> {
        return this.http.get<any>(`${environment.url_api}panic`)
        .pipe(
        map(result => {
            return JSON.parse(JSON.stringify(result.Panic)).map(item => {                
                return new Panic(
                    item.id,
                    item.data.uid,
                    item.data.nombre,
                    item.data.status,
                    item.data.telefono,
                    item.data.createAt,
                    item.data.latitud,
                    item.data.longitud
                );
            });
        })
        );
    }

    //   changeStatus(stat: Status) {
    //     let data = {
    //       id: stat.id_report,
    //       status: stat.status,
    //       modificationAt: stat.fecha,
    //     }

    //     return this.http.put<any>(`${environment.url_api}setstatus`, data)
    //     .pipe(
    //       map(result => {
    //         return result;
    //       })
    //     );
    //   }
}