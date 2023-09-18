import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisorRoutingModule } from './visor-routing.module';
import { VisorComponent } from './visor.component';
import { MapModule } from '@shared/components';

@NgModule({
  declarations: [
    VisorComponent
  ],
  imports: [
    CommonModule,
    VisorRoutingModule,
    MapModule
  ]
})
export class VisorModule { }
