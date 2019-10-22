import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BoxModule, TabsModule, DropdownModule } from 'angular-admin-lte';
import { RouterModule } from '@angular/router';
import { CoreRoutingModule } from './core-routing.module';
import { CoreComponent } from './core.component';

import { HeaderInnerComponent } from './header-inner/header-inner.component';
import { SidebarLeftInnerComponent } from './sidebar-left-inner/sidebar-left-inner.component';
import { SidebarRightInnerComponent } from './sidebar-right-inner/sidebar-right-inner.component';

import { LayoutModule } from 'angular-admin-lte';
import { LoadingPageModule, MaterialBarModule } from 'angular-loading-page';
import { adminLteConf } from '../admin-lte.conf-default';

import { NzSpinModule } from 'ng-zorro-antd/spin';

import { AccordionModule as MkAccordionModule } from 'angular-admin-lte';
import { NzDropDownModule, NZ_ICONS, NzModalModule, NgZorroAntdModule } from 'ng-zorro-antd';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';

import { NgxPermissionsModule } from 'ngx-permissions';

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])

@NgModule({
  declarations: [HeaderInnerComponent, SidebarLeftInnerComponent, SidebarRightInnerComponent, CoreComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    NzModalModule,
    NgZorroAntdModule,
    FormsModule,
    BoxModule,
    NzSpinModule,
    NzDropDownModule,
    ReactiveFormsModule,
    TabsModule,
    DropdownModule,
    RouterModule,
    MkAccordionModule,
    CoreRoutingModule,
    LayoutModule.forRoot(adminLteConf),
    LoadingPageModule,
    MaterialBarModule,
    NgxPermissionsModule.forChild()
  ],
  exports: [
    BoxModule,
    TabsModule, 
    HeaderInnerComponent, 
    SidebarLeftInnerComponent, 
    SidebarRightInnerComponent
  ],
  providers: [{ provide: NZ_ICONS, useValue: icons }]
})
export class CoreModule { }