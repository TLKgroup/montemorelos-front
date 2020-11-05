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
    ) {
        
    }
  
    getVerificado(): Observable<Verificado[]> {
        return this.http.get<any>(`${environment.url_api}verificado`)
        .pipe(
        map(result => {
            return JSON.parse(JSON.stringify(result.Verificado)).map(item => {                
                return new Verificado(
                    item.data.uidUser,
                    item.data.domicilio,
                    item.data.fachada,
                    item.data.ine,
                    item.data.ine2,
                    item.data.selfie,
                    item.data.completado
                );
            });
        })
        );
    }

}