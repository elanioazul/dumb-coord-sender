import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisorComponent } from './visor.component';
const routes: Routes = [
  {
		path: "",
		component: VisorComponent,
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisorRoutingModule { }
