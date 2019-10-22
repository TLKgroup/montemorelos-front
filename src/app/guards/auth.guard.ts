import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthentificationService } from '../services/authentification.service';


@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private authentificationService: AuthentificationService
    ) { }

    canActivate(router: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        const currentUser = this.authentificationService.currentUserValue;
        if (currentUser) {
            return true;
        }

        this.router.navigate(['/login'], { queryParams: { returnURL: state.url } });
        return false;
    }

}
