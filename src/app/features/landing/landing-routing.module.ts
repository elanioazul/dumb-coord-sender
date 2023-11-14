import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing.component';
import { ExternalIntegrationComponent } from './external-integration/external-integration.component';
const routes: Routes = [
  {
		path: "",
		component: LandingComponent,
    children: [
      { path: 'externalIntegration/:token', component: ExternalIntegrationComponent}
    ]
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }
