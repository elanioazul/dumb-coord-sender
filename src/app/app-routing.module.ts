import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from './components/map/map.component';
import { HomeComponent } from './components/home/home.component';

const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'map',
    component: MapComponent
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes, {
      useHash: true,
      anchorScrolling: 'enabled'
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
