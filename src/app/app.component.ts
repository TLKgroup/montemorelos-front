import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'angular-admin-lte';
import { Router } from '@angular/router';


import { AuthentificationService } from './services/authentification.service';
import { User } from './models/user';

import { setTheme } from 'ngx-bootstrap';



@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    public customLayout: boolean;
    public currentUser : User;

    constructor(
        private layoutService: LayoutService,
        private router: Router,
        private authenticationService: AuthentificationService
    ) {
        this.authenticationService.currentUser.subscribe(x => {
            this.currentUser = x
        });
        setTheme("bs3");
    }

    ngOnInit() {
        this.layoutService.isCustomLayout.subscribe((value: boolean) => {
            this.customLayout = value;
        });
        
    }

    logout() {
      this.authenticationService.logout();
      this.router.navigate(['/login']);
   }

}