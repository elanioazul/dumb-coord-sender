import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';

import { PrimengModule } from 'src/app/shared/components/primeng/primeng.module';
import { MapModule } from "@shared/components";
import { ExternalIntegrationComponent } from './external-integration/external-integration.component'

@NgModule({
  declarations: [
    LandingComponent, ExternalIntegrationComponent
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    PrimengModule,
    MapModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class LandingModule { }
