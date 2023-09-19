import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisorRoutingModule } from './visor-routing.module';
import { VisorComponent } from './visor.component';
import { MapModule } from '@shared/components';
import { VisorHeaderComponent } from './visor-header/visor-header.component';
import { VisorFooterComponent } from './visor-footer/visor-footer.component';
import { PrimengModule } from '@shared/components/primeng/primeng.module';

@NgModule({
  declarations: [
    VisorComponent,
    VisorHeaderComponent,
    VisorFooterComponent
  ],
  imports: [
    CommonModule,
    VisorRoutingModule,
    PrimengModule,
    MapModule
  ]
})
export class VisorModule { }
