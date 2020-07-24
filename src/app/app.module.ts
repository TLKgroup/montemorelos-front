import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor, JwtInterceptor } from './helpers';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { LayoutService, AlertModule } from 'angular-admin-lte';

import { NgZorroAntdModule} from 'ng-zorro-antd';

import { NZ_I18N, es_ES } from 'ng-zorro-antd';
import { registerLocaleData, CommonModule } from '@angular/common';

import { NgxPermissionsModule } from 'ngx-permissions';

import es from '@angular/common/locales/es-MX';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from '../environments/environment';

// import { AngularFireModule } from 'angularfire2'; 




const config: SocketIoConfig = { url: environment.url_api, options: {} };

// export const firebaseConfig = { 
//   apiKey: 'AIzaSyCzCwUui0D9uBJ2NR_n5p8eNLPLiXcY02A', 
//   authDomain: 'sabinas-app.firebaseapp.com', 
//   databaseURL: 'https://sabinas-app.firebaseio.com', 
//   storageBucket: 'sabinas-app.appspot.com', 
//   messagingSenderId: 'G-W2JQ10G1VL' 
// }; 

registerLocaleData(es);

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,    
    HttpClientModule,    
    AlertModule,
    BrowserAnimationsModule, 
    NgZorroAntdModule,
    NgxPermissionsModule.forRoot(), 
    // AngularFireModule.initializeApp(firebaseConfig),   
    SocketIoModule.forRoot(config), 
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    })
  ],
  providers: [
    { provide: NZ_I18N, useValue: es_ES },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    LayoutService
  ],
  exports: [
    CommonModule,
    NgxPermissionsModule 
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }