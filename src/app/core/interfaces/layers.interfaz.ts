import LayerGroup from 'ol/layer/Group';
import VectorLayer from 'ol/layer/Vector';
export interface ILayers {
    sanitationlayers: LayerGroup | null;
    adminLayers: LayerGroup | null;
    //coordinates: VectorLayer<any> | null;
    coordinates: LayerGroup | null;
    route: LayerGroup | null;
    coordinate: VectorLayer<any> | null;
}