import LayerGroup from 'ol/layer/Group';
import VectorLayer from 'ol/layer/Vector';
export interface ILayers {
    ortos: LayerGroup | null;
    construccions: LayerGroup | null;
    sanitationlayers: LayerGroup | null;
    adminLayers: LayerGroup | null;
    incidents: LayerGroup | null;
    resources: LayerGroup | null;
    incident: VectorLayer<any> | null;
}