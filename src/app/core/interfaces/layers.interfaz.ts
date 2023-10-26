import LayerGroup from 'ol/layer/Group';
import VectorLayer from 'ol/layer/Vector';
export interface ILayers {
    sanitationlayers: LayerGroup | null;
    adminLayers: LayerGroup | null;
    incidents: LayerGroup | null;
    incident: VectorLayer<any> | null;
    route: LayerGroup | null;
    routeByClicks: LayerGroup | null;
}