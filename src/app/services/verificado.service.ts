import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as moment from 'moment'
import { Verificado } from '../models/verificado';

moment.locale('en');

@Injectable({
  providedIn: 'root'
})

export class VerificadoService {

  observable:Observable<Verificado[]>;  

  constructor(
    private http: HttpClient
  ) { }
  
    getVerificado(): Observable<Verificado[]> {
      return this.http.get<any>(`${environment.url_api}verificado`).pipe(
        map(result => {
          return JSON.parse(JSON.stringify(result.Verificado)).map(item => {                
            return new Verificado(
              item.id,
              item.data.completado,
              item.data.domicilio,
              item.data.fachada,
              item.data.ine,
              item.data.ine2,
              item.data.selfie,
              item.data.uidUser,
            );
          });
        })
      );
    }

    updateVerificado(idV:string, com: string, uidUser: string) {

      let data = {
        uid: idV,
        completado: com,
        uidUser: uidUser
      }
        
      return this.http.put<any>(`${environment.url_api}updateVerificado/`, data).pipe(
        map(result => {
          return result;
        })
      );
    }
}