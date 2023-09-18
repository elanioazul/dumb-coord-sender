import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

const appRoutes: Routes = [
	{
		path: "",
		redirectTo: "/landing-page",
		pathMatch: "full",
	},
	{
		path: "landing-page",
		loadChildren: () =>
			import("./pages/landingpage/landingpage.module").then(
				(m) => m.LandingpageModule
			),
	},
	{
		path: "visor-page",
		loadChildren: () =>
			import("./pages/visorpage/visorpage.module").then(
				(m) => m.VisorpageModule
			),
	},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes, {
      useHash: true,
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
