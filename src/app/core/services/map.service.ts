import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Coordinate } from 'ol/coordinate';
import {
  createMap,
  centerMap,
  createOSMBaseLayer,
  createVectorLayer,
  goToCoordinates,
  createBaseLayersGroupForLayerSwitcher,
  createLayerGroup
} from '../utils/ol';
import { Feature, Map } from 'ol';
// import { Geometry } from 'ol/geom';
// import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
// import VectorSource from 'ol/source/Vector';
import { Extent, getCenter } from 'ol/extent';
// import ImageWMS from 'ol/source/ImageWMS';
// import TileWMS from 'ol/source/TileWMS';
// import ImageLayer from 'ol/layer/Image';
// import TileLayer from 'ol/layer/Tile';
import { adminlayersParams, sanitarialayersParams } from '@core/consts/geoserver-layers'
import LayerGroup from 'ol/layer/Group';

interface IMaps {
  viewer: Map | null;
  overview: Map | null;
}

interface ILayers {
  sanitationlayers: LayerGroup | null;
  adminLayers: LayerGroup | null;
  //coordinates: VectorLayer<any> | null;
  coordinates: LayerGroup | null;
  coordinate: VectorLayer<any> | null;
}

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
    coordinates: null,
    coordinate: null
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
    if (layerId === 'coordinates' && this.layers.value['coordinates']) {
      (this.layers.value['coordinates'].getLayers() as any).getArray()[0].getSource().addFeature(feature);
    }
    if (layerId === 'coordinate') {
      this.layers.value['coordinate']?.getSource().clear();
      this.layers.value['coordinate']?.getSource().addFeature(feature);
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
        layers.coordinate!
      ], [createBaseLayersGroupForLayerSwitcher()]),
      viewer: createMap('viewer', [],[createBaseLayersGroupForLayerSwitcher(), layers.coordinates!, layers.adminLayers!, layers.sanitationlayers!]),
    };
    this.setMaps(initialMaps);
  }

  setMaps(maps: IMaps) {
    this.maps.next(maps);
  }

  initLayers(features: Feature[]): void {
    const initialLayers: ILayers = {
      sanitationlayers: createLayerGroup(sanitarialayersParams),
      adminLayers: createLayerGroup(adminlayersParams),
      coordinate: createVectorLayer([]),
      coordinates: createLayerGroup([], createVectorLayer(features))
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

  // setVectorStyle() {
  //   const vectorMapViewer = this.getLayerById('vectorMapViewer');
  //   const vectorOverview = this.getLayerById('vectorOverview');

  //   const setStyle = (feature: Feature) => {
  //     const style = new Style({
  //       image: new CircleStyle({
  //         radius: 10,
  //         stroke: new Stroke({
  //           color: '#fff',
  //         }),
  //         fill: new Fill({
  //           color: '#4caf50',
  //         }),
  //       }),
  //     });

  //     return style;
  //   }
  // }
}
