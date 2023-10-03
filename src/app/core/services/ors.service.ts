import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, combineLatest, map, Observable, of } from 'rxjs';
import { Coordinate } from 'ol/coordinate';
import { Feature } from 'ol';
import Polyline from 'ol/format/Polyline.js';
import LineString from 'ol/geom/LineString.js';
import { MapService } from './map.service';
import { ILayers } from '@core/interfaces/layers.interfaz';
import { Fill, Icon, Stroke, Style } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import proj4 from 'proj4';
import { Point } from 'ol/geom';
import { IMaps } from '@core/interfaces/maps.interfaz';

const apiUrlOrs = 'https://ors.apps.aroas.westeurope.aroapp.io/ors/v2/directions/driving-car?';

const originStyle = new Style({
  image: new Icon({
    anchorOrigin: 'top-right',
    anchorXUnits: 'pixels',
    anchorYUnits: 'pixels',
    opacity: 0.8,
    src: '../../../assets/icons/origin.png'
  })
});
const destinationStyle = new Style({
  image: new Icon({
    anchorOrigin: 'top-right',
    anchorXUnits: 'pixels',
    anchorYUnits: 'pixels',
    opacity: 0.8,
    src: '../../../assets/icons/destination.png'
  })
});
const rutaStyle = new Style({
  stroke: new Stroke({
    width: 6,
    color: [237, 212, 0, 0.8],
  }),
});
const geoMarkerStyle = new Style({
  image: new CircleStyle({
    radius: 7,
    fill: new Fill({color: 'orange'}),
    stroke: new Stroke({
      color: 'white',
      width: 2,
    }),
  }),
});

@Injectable({
  providedIn: 'root'
})
export class OrsService {

  private origin = new BehaviorSubject<Coordinate | null>(null);
  origin$ = this.origin.asObservable();
  private destination = new BehaviorSubject<Coordinate | null>(null);
  destination$ = this.destination.asObservable();

  getLatestRuteDetails$ = combineLatest([
    this.origin$,
    this.destination$
  ]);

  layers: ILayers;
  maps!: IMaps;

  constructor(
    private http: HttpClient,
    private mapService: MapService
    ) { 
    this.layers = this.mapService.getAllLayers();
    this.maps = this.mapService.getAllMaps();
  }

  setRecurso(coords: Coordinate):void {
    coords ? this.origin.next(coords) : this.origin.next(null);
  }
  setIncidente(coords: Coordinate):void {
    coords ? this.destination.next(coords) : this.destination.next(null);
  }

  getOrsInfo(from: Coordinate, to: Coordinate): Observable<any> {
    return this.http.get(apiUrlOrs + 'start=' + `${from}` + '&end=' + `${to}`)
    .pipe(
      catchError((error) => of(error)),
      map((res: any) => {
        if (!res) {
          throw new Error(
            'Error consultando ORS chronos'
          );
        } else {
          return res;
        }
      })
    );
  }

  setOrigin(coords: Coordinate): void {
    this.setRecurso(coords);
    const feature = this.createMercatorFeature(coords);
    feature.setStyle(originStyle);
    (this.layers.route?.getLayers() as any).getArray()[0].getSource().addFeature(feature);
    //this.setGeomarker(feature);

  }

  createMercatorFeature(coords: Coordinate): Feature {
    const source = new (proj4 as any).Proj('+proj=longlat +datum=WGS84 +no_defs +type=crs');
    const dest = new (proj4 as any).Proj('EPSG:3857');
    const {x, y} = proj4.transform(source, dest, [coords[0], coords[1]]);
    const coordinatesMercator = [x, y];
    const point = new Point(coordinatesMercator);
    const feature = new Feature(point);
    return feature;
  }

  setGeomarker(feature: Feature): void {
    let position = feature.getGeometry()?.clone();
    let geoMarker = new Feature({
      type: 'geoMarker',
      geometry: position,
    });
    geoMarker.setStyle(geoMarkerStyle);
    (this.layers.route?.getLayers() as any).getArray()[0].getSource().addFeature(geoMarker);
  }

  setDestination(coords: Coordinate): void {
    this.setIncidente(coords);
    const feature = this.createMercatorFeature(coords);
    feature.setStyle(destinationStyle);
    (this.layers.route?.getLayers() as any).getArray()[0].getSource().addFeature(feature);
  }


  setRuta(geometry: any): void {
    const linestringOriginal = new LineString(geometry.coordinates)
    const transformedLineString = new LineString(
      linestringOriginal.getCoordinates().map(coord => proj4("EPSG:4326", "EPSG:3857", coord))
    );
    const feature = new Feature({
      type: 'route',
      geometry: transformedLineString,
    });
    feature.setStyle(rutaStyle);
    (this.layers.route?.getLayers() as any).getArray()[0].getSource().addFeature(feature);
    setTimeout(() => {
      this.maps.viewer?.getView().fit((this.layers.route?.getLayers() as any).getArray()[0].getSource().getExtent()),
      { duration:1000 }
    }, 500);
  }
}
