import { Component, OnInit } from '@angular/core';

import { HomeService } from '../../services/home.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  totalProducto;
  totalCliente;
  totalUsuario;

  constructor(

    private homeService: HomeService
  ) { 

    this.homeService.totalProductos()
    .subscribe(result => {  
        this.totalProducto = result.Total;
    }, error => {
        console.log(error);
    });
    
    this.homeService.totalUsuarios()
    .subscribe(result => {
      this.totalUsuario = result.Total;
    }, error => {
      console.log(error);
    });

    this.homeService.totalClientes()
    .subscribe(result => {
      this.totalCliente = result.Total;
    }, error => {
      console.log(error);
    });
  }

  ngOnInit() {

  }

}
