//en realidad creo que este IOpenRouteServiceRes es un FeatureCollection o GeoJsonObject de geojson dependency
//deberia serlo, pero le habrán metido cosas extra que deja de ser estricto
import { FeatureCollection, Feature, GeoJSON, Geometry } from 'geojson';

export interface IRaymondOpenRouteServiceRes {
  latEnd: number;
  latStart: number;
  lngEnd: number;
  lngStart: number;
  routeBbox: number[];
  routeDistance: number;
  routePath: Array<number[]>;
  routeTime: number;
  routeWayPoints: number[];
}

export interface IOpenRouteServiceRes {
  bbox: number[];
  features: IFeature[];
  metadata: IMetadata;
  type: string;
}

export interface IFeature {
  bbox: number[];
  geometry: IGeometry;
  properties: IProperties;
  type: string;
}

export interface IGeometry {
  coordinates: Array<number[]>;
  type: string;
}

export interface IProperties {
  segments: ISegment[];
  summary: ISummary;
  way_points: number[];
}

export interface ISegment {
  distance: number;
  duration: number;
  steps: IStep[];
}

export interface IStep {
  distance: number;
  duration: number;
  instruction: string;
  name: string;
  type: number;
  way_points: number[];
}

export interface ISummary {
  distance: number;
  duration: number;
}

export interface IMetadata {
  attribution: string;
  engine: IEngine;
  query: IQuery;
  service: string;
  timestamp: number;
}

export interface IEngine {
  build_date: Date;
  graph_date: Date;
  version: string;
}

export interface IQuery {
  coordinates: Array<number[]>;
  format: string;
  profile: string;
}
