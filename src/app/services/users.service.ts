import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { Users } from '../models/users';

moment.locale('en');

@Injectable({
  providedIn: 'root'
})

export class UsersService {

    observable:Observable<Users[]>;  

    constructor(
        private http: HttpClient
    ) {
        
    }
  
    getUsers(): Observable<Users[]> {
        return this.http.get<any>(`${environment.url_api}users`).pipe(
        map(result => {
            return JSON.parse(JSON.stringify(result.Users)).map(item => {                
                return new Users(
                    item.data.uidUser,
                    item.data.age,
                    item.data.colony,
                    item.data.email,
                    item.data.name,
                    item.data.phone,
                    item.data.sex,
                    item.data.verificado,
                );
            });
        })
        );
    }

    getUsersW(uidUser: String): Observable<Users[]> {
        return this.http.get<any>(`${environment.url_api}usersW/${uidUser}`).pipe(
        map(result => {
            return JSON.parse(JSON.stringify(result.Users)).map(item => {                
                return new Users(
                    item.data.uidUser,
                    item.data.age,
                    item.data.colony,
                    item.data.email,
                    item.data.name,
                    item.data.phone,
                    item.data.sex,
                    item.data.verificado,
                );
            });
        })
        );
    }

}