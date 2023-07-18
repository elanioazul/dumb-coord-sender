interface IDms {
    degree: string,
    minute: string,
    second: string,
    cardinalPoint: string
  }
  interface INoDms {
    x: string,
    y: string
  }

export interface ITransformPayload {
    epsgSelected?: number;
    coords: Array<INoDms> | Array<Array<IDms>>
}
export interface ICheckAbsPayload {
    epsg: number | string;
    lon: number | string;
    lat: number | string;
}