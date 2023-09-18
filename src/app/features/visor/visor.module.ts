import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisorRoutingModule } from './visor-routing.module';
import { VisorComponent } from './visor.component';
import { MapModule } from '@shared/components';
import { VisorHeaderComponent } from './visor-header/visor-header.component';

@NgModule({
  declarations: [
    VisorComponent,
    VisorHeaderComponent
  ],
  imports: [
    CommonModule,
    VisorRoutingModule,
    MapModule
  ]
})
export class VisorModule { }
