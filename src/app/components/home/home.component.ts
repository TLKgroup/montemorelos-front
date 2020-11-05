import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { HomeService } from 'src/app/services/home.service';
import { Subscription, interval } from 'rxjs';
import { PanicService } from 'src/app/services/panic.service';
import { UsersService } from 'src/app/services/users.service';
import { VerificadoService } from 'src/app/services/verificado.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  totalReporte;
  totalReporte2;
  totalReporte3;
  totalUsuario;

  panic;

  isVisibleViewPanicAlert : Boolean = false;

  private updateSubscription: Subscription;

  constructor(
    private reportService : ReportService, 
    private homeService : HomeService, 
    private panicService : PanicService, 
    private usersService: UsersService,
    private verificadoService: VerificadoService,
  ) { 

    this.reportService.getReports().subscribe(result => {  
      var total = result.filter(obj => Number(obj.status) == 1);
      var total2 = result.filter(obj => Number(obj.status) == 2).length;
      var total3 = result.filter(obj => Number(obj.status) == 3).length;

      this.totalReporte = total.length;
      this.totalReporte2 = total2;
      this.totalReporte3 = total3;

    }, error => {
        console.log(error);
    });
    
    this.homeService.totalUsuarios().subscribe(result => {
      this.totalUsuario = result.Total;
    }, error => {
      console.log(error);
    });

    this.panicService.getPanic() .subscribe(request => {
      this.panic =  request.length;
    },
    error => {
      console.log(error);
    })








    this.usersService.getUsers() .subscribe(request => {
      console.log(request);
    },
    error => {
      console.log(error);
    })

    this.verificadoService.getVerificado() .subscribe(request => {
      console.log(request);
    },
    error => {
      console.log(error);
    })
  }

  ngOnInit() {
    // this.updateSubscription = interval(300).subscribe(
    //   (val) => { 

    //       this.panicService.getPanic() .subscribe(request => {
           

    //         if(request.length > this.panic) {
    //           this.showModalAlert();
    //         }

    //       },
    //       error => {
    //         console.log(error);
    //       }

    //     );  
    //   }
    // );
  }

  showModalAlert() {
    this.isVisibleViewPanicAlert = true;
  }

  handleCancelViewPanicAlert() {
    this.isVisibleViewPanicAlert = false;
    this.panic = [];
  }

}
