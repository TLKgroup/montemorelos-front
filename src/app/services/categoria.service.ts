import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Categoria } from '../models/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private http: HttpClient) { }

    getCategoria(): Observable<Categoria[]> {

    return this.http.get<any>(`${environment.url_api}categorias`)
        .pipe(
            map(result => {
                return JSON.parse(JSON.stringify(result.Categorias)).map(item => {                
                    return new Categoria(
                        item.id_categoria,
                        item.nombre_categoria
                    );
                });
            })
        );
    }

    addCategoria(categoria: Categoria){
        let data = {
            nombre_categoria: categoria.nombre_categoria
        }             

        return this.http.post<any>(`${environment.url_api}categorias`, data)
        .pipe(
            map(result => {                
                return result;
            })
        );
    }

    updateCategoria(categoria: Categoria) {
        let data = {
            nombre_categoria: categoria.nombre_categoria
        }        

        return this.http.put<any>(`${environment.url_api}categorias/${categoria.id_categoria}`, data)
        .pipe(
            map(result => {                
                return result;
            })
        );
    }

    deleteCategoria(id_categoria: string) {
        return this.http.delete<any>(`${environment.url_api}categorias/${id_categoria}`)
        .pipe(
            map(result => {                
                return result;
            })
        );
    }
}