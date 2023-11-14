import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Coordinate } from 'ol/coordinate';
import {
  createMap,
  centerMap,
  createOSMBaseLayer,
  createVectorLayer,
  createRutaVectorLayer,
  goToCoordinates,
  createBaseLayersGroupForLayerSwitcher,
  createLayerGroup,
  createClusterLayer
} from '../utils/ol';
import { Feature, Map } from 'ol';
import { Extent, getCenter } from 'ol/extent';
import { adminlayersParams, sanitarialayersParams } from '@core/consts/geoserver-layers'
import {IMaps} from '@core/interfaces/maps.interfaz';
import { ILayers } from '@core/interfaces/layers.interfaz';




@Injectable({
  providedIn: 'root',
})
export class MapService {
  private maps: BehaviorSubject<IMaps> = new BehaviorSubject<IMaps>({
    viewer: null,
    overview: null,
  });

  public maps$ = this.maps.asObservable();

  private layers: BehaviorSubject<ILayers> = new BehaviorSubject<ILayers>({
    sanitationlayers: null,
    adminLayers: null,
    incidents: null,
    route: null,
    incident: null
  });

  public layers$ = this.layers.asObservable();

  constructor() {}

  getAllLayers(): ILayers {
    return this.layers.value;
  }

  getAllMaps(): IMaps {
    return this.maps.value;
  }

  // getLayerById(
  //   layerId: string
  // ):
  //   | VectorLayer<VectorSource<Geometry>>
  //   | TileLayer<OSM>
  //   | VectorLayer<any>
  //   | void {
  //   const layer = this.layers.value[layerId as keyof ILayers];
  //   if (!layer) return;
  //   return layer;
  // }

  getMapById(mapId: string): Map | void {
    const map = this.maps.value[mapId as keyof IMaps];
    if (!map) return;
    return map;
  }

  setLayers(layers: ILayers) {
    this.layers.next(layers);
  }

  addFeature(layerId: string, feature: Feature) {
    //const layer = this.getLayerById(layerId);
    if (layerId === 'incidents' && this.layers.value['incidents']) {
      (this.layers.value['incidents'].getLayers() as any).getArray()[0].getSource().addFeature(feature);
    }
    if (layerId === 'incident') {
      this.layers.value['incident']?.getSource().clear();
      this.layers.value['incident']?.getSource().addFeature(feature);
    }
  }

  // addMultipleFeaturesToLayer(layerId: string, features: Feature[]) {
  //   const layer = this.getLayerById(layerId);
  //   if (!layer) return;
  //   layer.getSource().clear();
  //   layer.getSource().addFeatures(features);
  // }

  initMaps(layers: ILayers): void {
    const initialMaps = {
      overview: createMap('overview', [
        createOSMBaseLayer(), 
        layers.incident!
      ], [createBaseLayersGroupForLayerSwitcher()]),
      viewer: createMap('viewer', [],[createBaseLayersGroupForLayerSwitcher(), layers.incidents!, layers.adminLayers!, layers.sanitationlayers!, layers.route!]),
    };
    this.setMaps(initialMaps);
  }

  setMaps(maps: IMaps) {
    this.maps.next(maps);
  }

  initLayers(features: Feature[]): void {
    const initialLayers: ILayers = {
      sanitationlayers: createLayerGroup(sanitarialayersParams, 'Sanitàries'),
      adminLayers: createLayerGroup(adminlayersParams, 'Divisions administratives'),
      incident: createVectorLayer([]),
      incidents: createLayerGroup([], 'Incidents', createClusterLayer(features)),
      route: createLayerGroup([], 'Ruta a Incidente', createRutaVectorLayer('route')),
    };
    this.setLayers(initialLayers);
  }

  setMapView(mapId: string, coords: Coordinate) {
    const map: Map = this.getMapById(mapId)!;
    if (!map) return;
    goToCoordinates(map, coords);
  }

  setMapExtent(mapId: string, extent: Extent) {
    const map: Map = this.getMapById(mapId)!;
    if (!map) return;
    const center = getCenter(extent);
    map.getView().fit(extent, { padding: [100, 100, 100, 100] });
    map.getView().setCenter(center);
  }

  centerMap(mapId: string) {
    const map: Map = this.getMapById(mapId)!;
    if (!map) return;
    centerMap(map);
  }
}
