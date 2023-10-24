import { Component, OnDestroy, OnInit } from '@angular/core';
import { MapService } from './core/services/map.service';
import { CoordinatesService } from './core/services/coordinates.service';
import {
  transformPointToMercatorFeature,
  createFeaturesProjectionTransofmationNeeded,
} from './core/utils/ol';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private mapService: MapService,
    private coordService: CoordinatesService
  ) {}

  ngOnInit(): void {
    this.coordService.getTransformedCoordList$.subscribe((data: any) => {
      //const features = data.map((transformed: any) => transformPointToMercatorFeature(transformed.longitude, transformed.latitude))
      const features = createFeaturesProjectionTransofmationNeeded(data);
      this.mapService.initLayers(features);
    });
    this.mapService.layers$.subscribe((layers) => {
      this.mapService.initMaps(layers);
    });
  }

  ngOnDestroy(): void {}
}
