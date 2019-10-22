import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from '../../services/authentification.service';
import { User } from '../../models/user';

@Component({
    selector: 'app-header-inner',
    templateUrl: './header-inner.component.html',
    styleUrls: ['./header-inner.component.css']
})
export class HeaderInnerComponent implements OnInit {
    public currentUser: User;

    constructor(
        private authenticationService: AuthentificationService,
        private router: Router) {
        this.currentUser = this.authenticationService.currentUserValue;
    }

    ngOnInit() {        
      
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
}