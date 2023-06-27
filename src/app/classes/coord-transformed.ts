export class CoordinateTransformed {
    constructor(public id: number,
                public intialsCoordId: number,
                public longitude: string,
                public latitude: string,
                public srid: string,
                public geometry: any) {
    }
  }