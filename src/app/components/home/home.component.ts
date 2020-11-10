import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { HomeService } from 'src/app/services/home.service';
import { Subscription, interval } from 'rxjs';
import { PanicService } from 'src/app/services/panic.service';
import Swal from 'sweetalert2';
import { Panic } from 'src/app/models/panic';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  title = 'Alerta';
  totalReporte;
  totalUsuario;
  
  public panic: Panic[] = [];
  public panics: Panic[] = [];

  public panicDataSelected: Panic;

  public cantidadpanic;
  public cantidadpanics;

  public visto : Boolean = false;

  isVisibleViewPanicAlert : Boolean = false;

  private updateSubscription: Subscription;

  constructor(
    private reportService : ReportService, 
    private homeService : HomeService, 
    private panicService : PanicService
  ) { 

    this.reportService.getReports().subscribe(result => {  
      this.totalReporte = result.length;
    }, error => {
      console.log(error);
    });
    
    this.homeService.totalUsuarios().subscribe(result => {
      this.totalUsuario = result.Total;
    }, error => {
      console.log(error);
    });

    this.panicService.getPanic().subscribe(request => {
      this.panic = request.filter(obj => obj.status == "0");
      console.log(this.panic.length);
    },
    error => {
      console.log(error);
    })
  }

  ngOnInit() {
    // this.updateSubscription = interval(7500).subscribe((val) => { 

      this.panicService.getPanic().subscribe(request => {

        this.panics = request.filter(obj => obj.status == "0");
        console.log(this.panic.length);
        console.log(this.panics.length);

        if(this.panics.length > this.panic.length){
          this.reproducir();
          this.showModalAlert() 
        }

        this.panic = request;
      },
      error => {
        console.log(error);
      });  
      
    // });
  }

  showModal(): void {
    
    // this.panicDataSelected = JSON.parse(JSON.stringify(data));
    // console.log(this.panicDataSelected);

    Swal.fire({
      title: 'Alerta',
      text: 'Hola ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Enviar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.showModalAlert();
      }
    });
  }

  reproducir() {
    const audio = new Audio('../../../assets/songs/alerta.wav');
    audio.play();
  }

  showModalAlert() {
    this.isVisibleViewPanicAlert = true;
  }

  handleCancelViewPanicAlert() {
    this.isVisibleViewPanicAlert = false;
  }

}
