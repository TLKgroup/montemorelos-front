import { Component, OnInit } from '@angular/core';

import { HomeService } from '../../services/home.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  totalReporte;
  totalUsuario;

  constructor(

    private homeService: HomeService
  ) { 

    this.homeService.getReports()
    .subscribe(result => {  
        this.totalReporte = result.length;
    }, error => {
        console.log(error);
    });
    
    this.homeService.totalUsuarios()
    .subscribe(result => {
      this.totalUsuario = result.Total;
    }, error => {
      console.log(error);
    });
  }

  ngOnInit() {

  }

}
