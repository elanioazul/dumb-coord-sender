import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisorpageRoutingModule } from './visorpage-routing.module';
import { VisorpageComponent } from './visorpage.component';

import { VisorModule } from 'src/app/features/visor/visor.module';

@NgModule({
  declarations: [
    VisorpageComponent
  ],
  imports: [
    CommonModule,
    VisorpageRoutingModule,
    VisorModule
  ]
})
export class VisorpageModule { }
