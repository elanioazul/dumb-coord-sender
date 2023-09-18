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
        center: [242381.816692, 5070144.523184],
        zoom: 7,
        maxZoom: 20,
        projection: 'EPSG:3857'
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
        source: new OSM({
            url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            maxZoom: 18
        }),
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

export const transformPointToFeature = (lon: any, lat: any): Feature => {
  const source = new (proj4 as any).Proj('+proj=utm +zone=31 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs');//https://epsg.io/25831 proj4 definition
  const dest = new (proj4 as any).Proj('EPSG:3857');
  const {x, y} = proj4.transform(source, dest, [lon, lat]);
  const coords = [x, y];
  const point = new Point(coords);
  return new Feature(point);
}

export const createFeaturesProjectionTransofmationNeeded = (elems: any[]): Feature[] => {
  let source: any;
  const dest = new (proj4 as any).Proj('EPSG:3857');
  const determineSourceSrid = (sridId: number): any => {
    switch (sridId) {
      case 1:
      case 2:
        source = new (proj4 as any).Proj('+proj=longlat +datum=WGS84 +no_defs +type=crs');
        break;
      case 3:
        source = new (proj4 as any).Proj('EPSG:3857');
        break;
      case 4:
        source = new (proj4 as any).Proj('+proj=utm +zone=31 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs +type=crs'); 
        break;
      case 5:
      case 6:
        source = new (proj4 as any).Proj('+proj=longlat +ellps=GRS80 +no_defs +type=crs');
        break;
      case 7:
        source = new (proj4 as any).Proj('+proj=utm +zone=31 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs');
        break;
      default:
        alert( "I don't know such value" );
    }
  }

  const features = elems.map((elem) => {
    determineSourceSrid(elem.srid)
    const {x, y} = proj4.transform(source, dest, [elem.longitude, elem.latitude]);
    const coords = [x, y];

    const point = new Point(coords);
    const feature = new Feature(point);
    // feature.setProperties(elem);
    // feature.setId(elem.id);
    return feature;
  });

  return features;
}
export const createFeature = (coords: Coordinate): Feature => {
    const point = new Point(coords);
    const feature = new Feature(point);
    return feature;
}