import { Component, OnDestroy, OnInit } from '@angular/core';
import { MapService } from './core/services/map.service';
import { CoordinatesService } from './core/services/coordinates.service';
import {
  transformPointToMercatorFeature,
  createFeaturesProjectionTransofmationNeeded,
  createResourceFeaturesProjectionTransofmationNeeded,
} from './core/utils/ol';
import { combineLatest } from 'rxjs';
import { GeoserverService } from '@core/services/geoserver.service';
import { CoordinateTransformed } from '@core/classes/coord-transformed';
import { FeatureCollection } from '@core/interfaces/recurso-geoserver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(
    private mapService: MapService,
    private coordService: CoordinatesService,
    private geoserverService: GeoserverService
    ) {}

  ngOnInit(): void {
    combineLatest([this.coordService.getTransformedCoordList$, this.geoserverService.getRecursosGeoJson$]).subscribe(
      ([coords, featureCollection]) => {
        const incidentes: CoordinateTransformed[] = coords;
        const indicentesFeatures = createFeaturesProjectionTransofmationNeeded(incidentes);
        const recursos: FeatureCollection = featureCollection;
        const recursosFeatures = createResourceFeaturesProjectionTransofmationNeeded(recursos.features);//importante: no sé por qué, pero con 7 que debería ser (recusos vienen con 25831), la proj4 que sale de la funcion determineSourceSrid no transofoma bien
        this.mapService.initLayers(indicentesFeatures, recursosFeatures);
        this.mapService.layers$.subscribe((layers) => {
          this.mapService.initMaps(layers);
        });
      }
    )
  }

  ngOnDestroy(): void {}
}
