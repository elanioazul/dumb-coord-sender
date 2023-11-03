import { Tiporecurso} from '@core/enums/tipo-recurso.enum';
//import { IRecurso} from '@core/interfaces/reecurso-interfaz';
export class Resource {
    constructor(private resourceId: number,
        public coordx: number,
        public coordy: number,
        public distance: number,
        public tiporecurso: Tiporecurso) {
    }
  }

