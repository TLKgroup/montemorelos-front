import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Report } from '../models/reports';
import { lastPanic } from '../models/lastPanic';
import { PanicFilter } from '../models/panicFilter';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    private http: HttpClient
  ) { }

  getReports(): Observable<Report[]> {
    return this.http.get<any>(`${environment.url_api}reportes`).pipe(map(result => {
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
    }));
  }

  totalUsuarios() {
    return this.http.get<any>(`${environment.url_api}usuarios/count/totales`).pipe(
        map(data => {
          return data;
        })
      );
  }

  getLastPanic(): Observable<lastPanic[]> {
    return this.http.get<any>(`${environment.url_api}getPanicFirebase`).pipe(map(result => {
      return JSON.parse(JSON.stringify(result.lastPanic)).map(item => {
        return new lastPanic(
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

  getPanicFilter(): Observable<PanicFilter[]> {
    return this.http.get<any>(`${environment.url_api}panicfilter`).pipe(map(result => {
      return JSON.parse(JSON.stringify(result.PanicFilter)).map(item => {
        return new PanicFilter(
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

  getPanicW(uidUser: string): Observable<PanicFilter[]> {
    return this.http.get<any>(`${environment.url_api}getPanicW/${uidUser}`).pipe(map(result => {
      return JSON.parse(JSON.stringify(result.PanicW)).map(item => {
        return new PanicFilter(
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

  getTotalPanic() {
    return this.http.get<any>(`${environment.url_api}totalPanic`).pipe(
      map(result => {
        return result;
      })
    );
  }

  updatestatus(datos) {

    let data = {
      id: datos.id,
      status: datos.status,
    }

    console.log(data);

    return this.http.put<any>(`${environment.url_api}setstatusPanic`, data).pipe(map(result => {
      return result;
    })
    );
  }
}
