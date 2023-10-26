import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { BehaviorSubject, catchError, combineLatest, map, Observable, of, throwError } from 'rxjs';
import { Coordinate } from 'ol/coordinate';
import { Feature } from 'ol';
import LineString from 'ol/geom/LineString.js';
import { MapService } from './map.service';
import { ILayers } from '@core/interfaces/layers.interfaz';
import { Fill, Icon, Stroke, Style } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import proj4 from 'proj4';
import { Point } from 'ol/geom';
import { IMaps } from '@core/interfaces/maps.interfaz';
import { createTextStyle } from '@core/utils/ol';
import { pin } from '@core/enums/pin.marker.enum';
import { IOpenRouteServiceRes } from '@core/interfaces/ors.response.interfaz';

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
const startStyle = new Style({
  image: new Icon({
    anchorOrigin: 'top-right',
    anchorXUnits: 'pixels',
    anchorYUnits: 'pixels',
    opacity: 0.8,
    src: '../../../assets/icons/startpoint.png',
    anchor: [15, 30]
  })
});
const endStyle = new Style({
  image: new Icon({
    anchorOrigin: 'top-right',
    anchorXUnits: 'pixels',
    anchorYUnits: 'pixels',
    opacity: 0.8,
    src: '../../../assets/icons/endpoint.png',
    anchor: [15, 30]
  })
});
const rutaByClicksStyle = new Style({
  stroke: new Stroke({
    width: 6,
    color: [0, 0, 0, 1],
  }),
});

@Injectable({
  providedIn: 'root'
})
export class OrsService {

  private recurso = new BehaviorSubject<Coordinate | null>(null);
  recurso$ = this.recurso.asObservable();
  private incidente = new BehaviorSubject<Coordinate | null>(null);
  incidente$ = this.incidente.asObservable();

  getLatestRuteDetails$ = combineLatest([
    this.recurso$,
    this.incidente$
  ]);

  private startPoint = new BehaviorSubject<Coordinate | null>(null);
  startPoint$ = this.startPoint.asObservable();
  private endPoint = new BehaviorSubject<Coordinate | null>(null);
  endPoint$ = this.endPoint.asObservable();

  layers: ILayers;
  maps!: IMaps;

  constructor(
    private http: HttpClient,
    private mapService: MapService
    ) { 
    this.layers = this.mapService.getAllLayers();
    this.maps = this.mapService.getAllMaps();
  }

  //////////////////////
  /*common*/
  /////////////////////
  getOrsInfo(from: Coordinate, to: Coordinate): Observable<IOpenRouteServiceRes> {
    return this.http.get<IOpenRouteServiceRes>(apiUrlOrs + 'start=' + `${from}` + '&end=' + `${to}`)
    .pipe(
      map((res: any) => {
        if (!res.error) {
          return res
        }
      }),
      catchError((error) => {
        return throwError(() => error)
      })
    );
  }

  setGeomarker(feature: Feature): void {
    let position = feature.getGeometry()?.clone();
    let geoMarker = new Feature({
      geometry: position,
    });
    geoMarker.setId('geoMarker');
    geoMarker.setStyle(geoMarkerStyle);
    (this.layers.route?.getLayers() as any).getArray()[0].getSource().addFeature(geoMarker);
  }

  //////////////////////
  /*visor-navigator widget*/
  /////////////////////

  setRecurso(coords: Coordinate):void {
    this.recurso.next(coords);
  }
  setRecursoToNull():void {
    this.recurso.next(null);
  }
  getRecurso(): Coordinate | null {
    return this.recurso.value;
  }

  setIncidente(coords: Coordinate):void {
    this.incidente.next(coords);
  }
  setIncidenteToNull():void {
    this.incidente.next(null);
  }
  getIncidente(): Coordinate | null {
    return this.incidente.value;
  }

  setOrigin(coords: Coordinate, label: string): void {
    this.setRecurso(coords);
    const feature = this.createMercatorFeature(coords, 'origin');
    originStyle.setText(createTextStyle(feature, this.maps.viewer?.getView().getResolution(), label, pin.origin))
    feature.setStyle(originStyle);
    (this.layers.route?.getLayers() as any).getArray()[0].getSource().addFeature(feature);
    //this.setGeomarker(feature);

  }

  setDestination(coords: Coordinate): void {
    this.setIncidente(coords);
    const feature = this.createMercatorFeature(coords, 'destination');
    destinationStyle.setText(createTextStyle(feature, this.maps.viewer?.getView().getResolution(), 'incidente: ' + coords.toString(), pin.destination))
    feature.setStyle(destinationStyle);
    (this.layers.route?.getLayers() as any).getArray()[0].getSource().addFeature(feature);
  }

  createMercatorFeature(coords: Coordinate, type: string): Feature {
    const source = new (proj4 as any).Proj('+proj=longlat +datum=WGS84 +no_defs +type=crs');
    const dest = new (proj4 as any).Proj('EPSG:3857');
    const {x, y} = proj4.transform(source, dest, [coords[0], coords[1]]);
    const coordinatesMercator = [x, y];
    const point = new Point(coordinatesMercator);
    const feature = new Feature({
      geometry: point
    });
    feature.setId(type);
    return feature;
  }

  setRuta(geometry: any): void {
    const linestringOriginal = new LineString(geometry.coordinates)
    const transformedLineString = new LineString(
      linestringOriginal.getCoordinates().map(coord => proj4("EPSG:4326", "EPSG:3857", coord))
    );
    const feature = new Feature({
      geometry: transformedLineString,
    });
    feature.setId('route');
    feature.setStyle(rutaStyle);
    (this.layers.route?.getLayers() as any).getArray()[0].getSource().addFeature(feature);
    setTimeout(() => {
      this.maps.viewer?.getView().fit((this.layers.route?.getLayers() as any).getArray()[0].getSource().getExtent()),
      { duration:1000 }
    }, 500);
  }

  deleteFeatureFromRouteLayer(features: Feature[]): void {
    features.forEach((feature: Feature) => (this.layers.route?.getLayers() as any).getArray()[0].getSource().removeFeature(feature));
  }
  
  removeFeaturesFromRoute(): void {
    (this.layers.route?.getLayers() as any).getArray()[0].getSource().clear();
  }

  getRutaFeatureByType(type: string): Feature {
    return (this.layers.route?.getLayers() as any).getArray()[0].getSource().getFeatureById(type);
  }

  //////////////////////
  /*visor-navigator by clicks widget*/
  /////////////////////

  setStartPoint(coords: Coordinate):void {
    this.startPoint.next(coords);
  }
  setStartPointToNull():void {
    this.startPoint.next(null);
  }
  getStartPoint(): Coordinate | null {
    return this.startPoint.value;
  }

  setEndPoint(coords: Coordinate):void {
    this.endPoint.next(coords);
  }
  setEndPointToNull():void {
    this.endPoint.next(null);
  }
  getEndPoint(): Coordinate | null {
    return this.endPoint.value;
  }
  
  setRutaByClicks(geometry: any): void {
    const linestringOriginal = new LineString(geometry.coordinates)
    const transformedLineString = new LineString(
      linestringOriginal.getCoordinates().map(coord => proj4("EPSG:4326", "EPSG:3857", coord))
    );
    const feature = new Feature({
      geometry: transformedLineString,
    });
    feature.setId('route-by-clicks');
    feature.setStyle(rutaByClicksStyle);
    (this.layers.routeByClicks?.getLayers() as any).getArray()[0].getSource().addFeature(feature);
    setTimeout(() => {
      this.maps.viewer?.getView().fit((this.layers.routeByClicks?.getLayers() as any).getArray()[0].getSource().getExtent()),
      { duration:1000 }
    }, 500);
  }
  
  loadStartPoint(coords: Coordinate): void {
    this.setStartPoint(coords);
    const feature = this.createMercatorFeature(coords, 'start-point');
    feature.setStyle(startStyle);
    (this.layers.routeByClicks?.getLayers() as any).getArray()[0].getSource().addFeature(feature);
  }

  loadEndPoint(coords: Coordinate): void {
    this.setEndPoint(coords);
    const feature = this.createMercatorFeature(coords, 'end-point');
    feature.setStyle(endStyle);
    (this.layers.routeByClicks?.getLayers() as any).getArray()[0].getSource().addFeature(feature);
  }

  deleteFeatureFromRouteByClicksLayer(features: Feature[]): void {
    features.forEach((feature: Feature) => (this.layers.routeByClicks?.getLayers() as any).getArray()[0].getSource().removeFeature(feature));
  }

  removeFeaturesFromRouteByClicks(): void {
    (this.layers.routeByClicks?.getLayers() as any).getArray()[0].getSource().clear();
  }

  getRutaByclicksFeatureByType(type: string): Feature {
    return (this.layers.routeByClicks?.getLayers() as any).getArray()[0].getSource().getFeatureById(type);
  }
}
