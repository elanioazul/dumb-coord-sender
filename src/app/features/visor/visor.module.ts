import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { VisorRoutingModule } from './visor-routing.module';
import { VisorComponent } from './visor.component';
import { MapModule } from '@shared/components';
import { VisorHeaderComponent } from './visor-header/visor-header.component';
import { PrimengModule } from '@shared/components/primeng/primeng.module';
import { VisorNotificationsBarComponent } from './visor-notifications-bar/visor-notifications-bar.component';
import { VisorSidebarComponent } from './visor-sidebar/visor-sidebar.component';
import { VisorNavigatorComponent } from './visor-navigator/visor-navigator.component';
import { VisorMeasurementComponent } from './visor-measurement/visor-measurement.component';

@NgModule({
  declarations: [
    VisorComponent,
    VisorHeaderComponent,
    VisorNotificationsBarComponent,
    VisorSidebarComponent,
    VisorNavigatorComponent,
    VisorMeasurementComponent
  ],
  imports: [
    CommonModule,
    VisorRoutingModule,
    PrimengModule,
    MapModule,
    FormsModule
  ]
})
export class VisorModule { }
