import { Coordinate } from 'ol/coordinate';
import { Tiporecurso } from '@core/enums/tipo-recurso.enum';

// export interface IRecurso {
//   name: string;
//   coordinates: Coordinate;
// }

export interface IResourcesByRadioRes {
  content: IRecurso[];
  pageable: Pageable;
}

export interface IRecurso {
  coordx: number;
  coordy: number;
  distance: number;
  resourceId: number;
  tiporecurso: Tiporecurso;
}

export interface Pageable {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
