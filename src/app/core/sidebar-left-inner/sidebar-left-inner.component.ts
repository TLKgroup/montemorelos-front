import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../../services/authentification.service';

@Component({
  selector: 'app-sidebar-left-inner',
  templateUrl: './sidebar-left-inner.component.html',
  styleUrls: ['./sidebar-left-inner.component.css']
})
export class SidebarLeftInnerComponent implements OnInit {
  public currentUser;

  constructor(
    private authenticationService: AuthentificationService) { 
      this.currentUser = this.authenticationService.currentUserValue;
    }

  ngOnInit() {
    //console.log(this.currentUser.usuario);
  }

}
