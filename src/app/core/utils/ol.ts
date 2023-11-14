import { Feature, Map, View } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { Geometry, Point } from 'ol/geom';
import Layer from 'ol/layer/Layer';
import TileLayer from 'ol/layer/Tile';
import LayerTile from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Cluster from 'ol/source/Cluster';
import OSM from 'ol/source/OSM';
import { Circle as CircleStyle, Icon, Text } from 'ol/style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import proj4 from 'proj4';
import {IconAnchorUnits, IconOrigin} from 'ol/style/Icon';

import { Attribution, OverviewMap, Control, Zoom, ScaleLine, MousePosition } from 'ol/control';
//import DragZoom from 'ol/interaction/DragZoom.js';

import {
  BaseLayerOptions,
  GroupLayerOptions
 } from 'ol-layerswitcher';
 import BingMaps from 'ol/source/BingMaps';
 import SourceStamen from 'ol/source/Stamen';
import LayerGroup from 'ol/layer/Group';

import TileWMS from 'ol/source/TileWMS';
import ImageWMS from 'ol/source/ImageWMS';
import ImageLayer from 'ol/layer/Image';
import { fromLonLat } from 'ol/proj';
import { pin } from '@core/enums/pin.marker.enum';



//geoserver url
const geoserverUrl = 'http://localhost:8080/geoserver/ows?';

//controls
//const dragZoom = new DragZoom();
const zoom = new Zoom();

const scale = new ScaleLine();
const overviewMapControl = new OverviewMap({
  className: 'ol-overviewmap ol-custom-overviewmap',
  layers: [
      new TileLayer({
          source: new OSM({
              'url': 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
          })
      })
  ],
  collapsed: true,
  tipLabel: 'Mapa de referencia',
  label: '«',
  collapseLabel: '»'
})

//view
const view = new View({
  center: [242381.816692, 5070144.523184],
  zoom: 7,
  maxZoom: 20,
  projection: 'EPSG:3857'
})

//capasBase
const osm = new LayerTile ({
  visible: true,
  opacity: 0.8,
  source: new OSM(),
  title: 'OpenStreetMap',
  type: 'base',
  maxZoom: 18
} as BaseLayerOptions);
const toner = new LayerTile({
  title: 'Toner',
  type: 'base',
  visible: false,
  source: new SourceStamen({
    layer: 'toner'
  })
} as BaseLayerOptions);
const google = new LayerTile({
  visible: false,
  opacity: 0.9,
  source: new OSM({
    'url': 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
  }),
  title: 'GoogleMaps',
  type: 'base',
  maxZoom: 18
} as BaseLayerOptions);
const bing = new TileLayer({
  title: 'Aerial',
  type: 'base',
  visible: false,
  preload: Infinity,
  source: new BingMaps({
    key: 'AuOnHkagHRMe9v1n1yJMNM0G4iyXee2OC_pWr4K9moD63ppuwCIsKAwKJUgEP9CR',
    imagerySet: 'Aerial',
    maxZoom: 18
  }),
} as BaseLayerOptions);
const baseMaps = new LayerGroup({
  title: 'Base maps',
  layers: [osm, google, bing, toner]
} as GroupLayerOptions);

export const createBaseLayersGroupForLayerSwitcher = (): LayerGroup => {
  return baseMaps;
}
export const addMouseControlToMap = (target: HTMLElement, map: Map) => {
  const mouse = new MousePosition({
    coordinateFormat: function (coordinates) {
      var coord_x = coordinates?.[0].toFixed(3);
      var coord_y = coordinates?.[1].toFixed(3);
      return `x:` + coord_x + ' | ' + `y:` + coord_y + ` (${map.getView().getProjection().getCode()})`;
    },
    target: target
  });
  map.addControl(mouse);
}

export const createMap = (target: string, layers: Layer[], layerGroup: LayerGroup[]): Map => {
  let  map;
  if (target === 'viewer') {
    map = new Map({
      layers: [
        ...layers,
        ...layerGroup
      ],
      //interactions: [dragZoom],
      controls: [overviewMapControl, zoom, scale],
    });
  } else {
    map = new Map({
      layers: [
        ...layers
      ]
    });
  }
  map.setTarget(target);
  map.setView(view)
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

export const createLayerGroup = (params: any[], title: string, layer?: any): LayerGroup => {
  let group: LayerGroup;
  if (params.length > 1) {
    group = new LayerGroup({
      title: title,
      layers: params.map(param => createWMSlayer(param)),
      fold: 'open'
    } as GroupLayerOptions)
  } else if (params.length == 1) {
    group = new LayerGroup({
      title: title,
      layers: params.map(param => createWMSlayer(param)),
      fold: 'open'
    } as GroupLayerOptions)
  } else {
    group = new LayerGroup({
      title: title,
      layers: [layer],
      fold: 'open'
    } as GroupLayerOptions)
  }
  return group;
}

export const createWMSlayer = (param: any): ImageLayer<ImageWMS> | TileLayer<TileWMS> => {
  let layer: any;
  if (param.TILED == true) {
    const source = new TileWMS({
      url: geoserverUrl,
      params: param,
      serverType: 'geoserver',
    });
    layer = new TileLayer({
      source: source,
      title: `${param.LAYERS}`,
      visible: false

    } as BaseLayerOptions)
  }
  if (param.TILED == false) {
    const source = new ImageWMS({
      url: geoserverUrl,
      params: param,
      ratio: 1,
      serverType: 'geoserver',
    });
    layer = new ImageLayer({
      source: source,
      title: `${param.LAYERS}`,
      visible: false

    } as BaseLayerOptions)
  }
  return layer;

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
    title: 'Incidente',
  } as BaseLayerOptions);

  return vectorLayer;
};

export const createClusterLayer = (features: Feature[]): VectorLayer<VectorSource<Geometry>> => {

  const source = new VectorSource({
    features: features,
  });

  const clusterSource = new Cluster({
    distance: 20,
    minDistance: 20,
    source: source,
  });

  const clustersLayer = new VectorLayer({
    source: clusterSource,
    style: function (feature) {
      const size = feature.get('features').length;
      const style = new Style({
        image: new CircleStyle({
          radius: 10,
          stroke: new Stroke({
            color: '#fff',
          }),
          fill: new Fill({
            color: '#3399CC',
          }),
        }),
        text: new Text({
          text: size.toString(),
          fill: new Fill({
            color: '#fff',
          }),
        }),
      });

      return style;
    },
    title: 'Incidentes'
  } as BaseLayerOptions);
  
  return clustersLayer;
};

export const transformPointToMercatorFeature = (sirdId: number, lon: any, lat: any): Feature => {
  const source = determineSourceSrid(sirdId);
  const dest = new (proj4 as any).Proj('EPSG:3857');
  const {x, y} = proj4.transform(source, dest, [lon, lat]);
  const coords = [x, y];
  const point = new Point(coords);
  return new Feature(point);
}

export const transformMercatorCoordsTo4326Point = (lon: any, lat: any): Point => {
  const source = new (proj4 as any).Proj('EPSG:3857');
  const dest = new (proj4 as any).Proj('+proj=longlat +datum=WGS84 +no_defs +type=crs');
  const {x, y} = proj4.transform(source, dest, [lon, lat]);
  const coords = [x, y];
  return new Point(coords);
}

export const transform4326CoordsToMercatorPoint = (lon: any, lat: any): Point => {
  const source = new (proj4 as any).Proj('+proj=longlat +datum=WGS84 +no_defs +type=crs');
  const dest = new (proj4 as any).Proj('EPSG:3857');
  const {x, y} = proj4.transform(source, dest, [lon, lat]);
  const coords = [x, y];
  return new Point(coords);
}

export const createFeaturesProjectionTransofmationNeeded = (elems: any[]): Feature[] => {
  let source: any;
  const dest = new (proj4 as any).Proj('EPSG:3857');

  const features = elems.map((elem) => {
    source = determineSourceSrid(elem.srid)
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

export const flyToPosition = (map: Map, lat: number, lon: number): void => {
  map.getView();
  const duration = 4000;
  const zoom = map.getView().getZoom();
  let parts = 2;
  let called = false;
  const callback = (complete) => {
    --parts;
    if (called) {
      return;
    }
    if (parts === 0 || !complete) {
      called = true;
    }
  };
  if (zoom) {
    map.getView().animate(
      {
        center: fromLonLat([lon, lat]),
        duration: duration / 4,
      },
      callback
    );
    map.getView().animate(
      {
        zoom: zoom - 1,
        duration: duration / 5,
      },
      {
        zoom: 15,
        duration: duration / 2,
      },
      callback
    );
  }
}

export const createTextStyle = (feature: Feature, resolution: any, label: string, whatPin: string) => {
  let align;
  whatPin === pin.destination ? align = 'start' : align = 'end';
  const baseline = 'top';
  const fontFont = 'FontGIS'
  const weight = 'normal';
  const height = 1;
  const size = '18px';
  let offsetX;
  whatPin === pin.destination ? offsetX = 0 : offsetX = -15;
  const offsetY = -15;
  let color;
  whatPin === pin.destination ? color = '#050505' : color = '#db1d1d';
  const oulineColor = '#ffffff';
  const outlineWidth = 6;
  const font = weight + ' ' + size + '/' + height + ' ' + fontFont;
  return new Text({
    textAlign: align,
    textBaseline: baseline,
    font: font,
    text: getText(feature, resolution, label),
    fill: new Fill({color: color}),
    stroke: new Stroke({color: oulineColor, width: outlineWidth}),
    offsetY: offsetY,
    offsetX: offsetX
  });
}

export const getClusterStyle = (features: Feature[], condition: boolean) => {
  const style =  new Style({
    image: new CircleStyle({
      radius: 10,
      stroke: new Stroke({
        color: '#fff',
      }),
      fill: new Fill({
        color: condition ? '#4caf50' : '#3399CC',
      }),
    }),
    text: new Text({
      text: features.length.toString(),
      fill: new Fill({
        color: '#fff',
      }),
    }),
  });
  return style;
}

const getText = (feature: Feature, resolution: any, label: string) => {
  const maxResolution = 1600;
  //let text = feature.get('name');
  let text = label;

  if (resolution > maxResolution) {
    text = '';
  } else {
    return text;
  }

  return text;
};

const determineSourceSrid = (sridId: number): any => {
  let source: any
  switch (sridId) {
    case 1:
    case 2:
      source = new (proj4 as any).Proj('+proj=longlat +datum=WGS84 +no_defs +type=crs');
      return source;
      break;
    case 3:
      source = new (proj4 as any).Proj('EPSG:3857');
      return source;
      break;
    case 4:
      source = new (proj4 as any).Proj('+proj=utm +zone=31 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs +type=crs'); 
      return source;
      break;
    case 5:
    case 6:
      source = new (proj4 as any).Proj('+proj=longlat +ellps=GRS80 +no_defs +type=crs');
      return source;
      break;
    case 7:
      source = new (proj4 as any).Proj('+proj=utm +zone=31 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs');
      return source;
      break;
    default:
      alert( "I don't know such value" );
  }
}