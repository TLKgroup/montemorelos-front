import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';

import { NzTableModule, NzDropDownModule  } from 'ng-zorro-antd';

import { BoxModule } from 'angular-admin-lte';

import { NgZorroAntdModule, NZ_ICONS, NzSelectModule, NzModalModule } from 'ng-zorro-antd';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';

import { NzTreeModule } from 'ng-zorro-antd/tree';

import { NgxPermissionsModule } from 'ngx-permissions';

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};

const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])

import 'rxjs';

@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    NzTableModule,
    UsersRoutingModule,
    NzDropDownModule,
    NgZorroAntdModule,
    NzTreeModule,
    NzSelectModule,
    NzModalModule,
    BoxModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPermissionsModule.forChild()
  ],
  providers: [{ provide: NZ_ICONS, useValue: icons }]
})
export class UsersModule { }
