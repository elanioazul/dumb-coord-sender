import { Feature, Map, View } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { Geometry, Point } from 'ol/geom';
import Layer from 'ol/layer/Layer';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import OSM from 'ol/source/OSM';
import { Circle as CircleStyle } from 'ol/style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import proj4 from 'proj4';

export const createMap = (target: string, layers: Layer[]): Map => {
    const map = new Map({
      view: new View({
        center: [431161.696445, 4581944.306753],
        zoom: 14,
        maxZoom: 20,
        projection: 'EPSG:25831'
      }),
      layers: [
        ...layers
      ],
      target: target,
    });
    return map;
}

  export const centerMap = (map: Map):void => {
    map.setView(new View({
      center: [431161.696445, 4581944.306753],
      zoom: 12,
      maxZoom: 20
    }))
  }

  export const goToCoordinates = (map: Map, coords: Coordinate): void => {
    map.setView(new View({
      center: coords,
      zoom: 20,
      maxZoom: 20
    }));
  }

  export const createOSMBaseLayer = (): TileLayer<OSM> => {
    const OsmLayer = new TileLayer({
        title: 'OSM',
        visible: true,
        source: new OSM({
            //'url': 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
        }),
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    });
    return OsmLayer;
  }

  export const createVectorLayer = (features: Feature[]): VectorLayer<VectorSource<Geometry>> => {

    const source = new VectorSource({
      features: features,
    });

    const vectorLayer = new VectorLayer({
      source: source,
      style: function (feature) {
        const style = new Style({
          image: new CircleStyle({
            radius: 10,
            stroke: new Stroke({
              color: '#fff',
            }),
            fill: new Fill({
              color: '#4caf50',
            }),
          }),
        });

        return style;
      },
    });

    return vectorLayer;
};

export const createFeaturesProjectionTransofmationNeeded = (elems: any[], sridOrigen: string): Feature[] => {
  const source = new (proj4 as any).Proj(`EPSG:${sridOrigen}`);
  const dest = new (proj4 as any).Proj('EPSG:25831');

  const features = elems.map((elem) => {
    const {x, y} = proj4.transform(source, dest, [elem.coordx, elem.coordy]);
    const coords = [x, y];

    const point = new Point(coords);
    const feature = new Feature(point);
    // feature.setProperties(elem);
    // feature.setId(elem.id);
    return feature;
  });

  return features;
}
export const createFeatures = (coords: Coordinate): Feature => {
    const point = new Point(coords);
    const feature = new Feature(point);
    return feature;
}