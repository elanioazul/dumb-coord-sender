import { Tiporecurso} from '@core/enums/tipo-recurso.enum';
import { IRecurso } from '@core/interfaces/reecurso-interfaz';
//import { IRecurso} from '@core/interfaces/reecurso-interfaz';
export class Resource {
    public resourceId;
    public distance;
    public coordx;
    public coordy;
    public tiporecurso;
    constructor(options: IRecurso) {
        this.resourceId = options.resourceId;
        this.distance = options.distance;
        this.coordx = options.coordx;
        this.coordy = options.coordy;
        this.tiporecurso = options.tiporecurso;

    }
  }

