import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisorRoutingModule } from './visor-routing.module';
import { VisorComponent } from './visor.component';
import { MapModule } from '@shared/components';
import { VisorHeaderComponent } from './visor-header/visor-header.component';
import { PrimengModule } from '@shared/components/primeng/primeng.module';
import { VisorNotificationsBarComponent } from './visor-notifications-bar/visor-notifications-bar.component';

@NgModule({
  declarations: [
    VisorComponent,
    VisorHeaderComponent,
    VisorNotificationsBarComponent
  ],
  imports: [
    CommonModule,
    VisorRoutingModule,
    PrimengModule,
    MapModule
  ]
})
export class VisorModule { }
