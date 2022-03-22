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

    constructor(
        private http: HttpClient
    ) { }
  
    getPanicFilter(): Observable<Panic[]> {
        return this.http.get<any>(`${environment.url_api}panicfilter`).pipe(map(result => {
          return JSON.parse(JSON.stringify(result.PanicFilter)).map(item => {
            return new Panic(
              item.id,
              item.data.uid,
              item.data.nombre,
              item.data.status,
              item.data.telefono,
              item.data.createAt,
              item.data.latitud,
              item.data.longitud,
              item.data.bateria,
            );
          });
        }));
      }

}