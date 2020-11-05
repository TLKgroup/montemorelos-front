import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { UsuariosRoutingModule } from './usuario-routing.module';
import { UsuariosComponent } from './usuarios.component';

import { NzTableModule, NzDropDownModule  } from 'ng-zorro-antd';

import { BoxModule } from 'angular-admin-lte';

import { NgZorroAntdModule, NZ_ICONS, NzSelectModule, NzModalModule } from 'ng-zorro-antd';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';

import { NzTreeModule } from 'ng-zorro-antd/tree';

import { NgxPermissionsModule } from 'ngx-permissions';

import { MglTimelineModule } from 'angular-mgl-timeline';

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};

const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])

import 'rxjs';

@NgModule({
  declarations: [UsuariosComponent],
  imports: [
    CommonModule,
    NzTableModule,
    UsuariosRoutingModule,
    NzDropDownModule,
    NgZorroAntdModule,
    NzTreeModule,
    NzSelectModule,
    NzModalModule,
    BoxModule,
    MglTimelineModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPermissionsModule.forChild()
  ],
  providers: [DatePipe, { provide: NZ_ICONS, useValue: icons }]
})
export class UsuariosModule { }
