import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { 

  }

  totalProductos() {
        
    return this.http.get<any>(`${environment.url_api}productos/count/totales`)
    .pipe(
        map(data => {  
            return data;
        })
    );
  }

  totalClientes() {
        
    return this.http.get<any>(`${environment.url_api}clientes/count/totales`)
    .pipe(
        map(data => {  
            return data;
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
