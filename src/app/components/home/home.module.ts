import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

import { BoxModule, BoxSmallModule as MkBoxSmallModule  } from 'angular-admin-lte';
import { NgZorroAntdModule, NZ_ICONS, NzSelectModule, NzModalModule } from 'ng-zorro-antd';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';


const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};

const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])

import 'rxjs';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    NgZorroAntdModule,
    NzSelectModule,
    NzModalModule,
    BoxModule,
    MkBoxSmallModule
  ],
  providers: [DatePipe, { provide: NZ_ICONS, useValue: icons }]
})
export class HomeModule { }
