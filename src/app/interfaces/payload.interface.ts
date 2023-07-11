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

export interface IPayload {
    epsgSelected?: number;
    coords: Array<INoDms> | Array<Array<IDms>>
}