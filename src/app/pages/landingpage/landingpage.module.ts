import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingpageRoutingModule } from './landingpage-routing.module';
import { LandingpageComponent } from './landingpage.component';

import { LandingModule } from 'src/app/features/landing/landing.module';

@NgModule({
  declarations: [
    LandingpageComponent
  ],
  imports: [
    CommonModule,
    LandingpageRoutingModule,
    LandingModule
  ]
})
export class LandingpageModule { }
