import { FormGroup, FormControl } from '@angular/forms';
import { ICoordinateSystem } from './coord-system.interfaz';
import { CoordinateSystem } from '../classes/coord-system';

/*Form de visor-search-by-coord*/
export interface IForm {
  epsgForm: FormGroup<any>;
  coordsForm: FormGroup<any>;
}
export interface IepsgForm {
  epsg: FormControl<number | null | undefined>;
}
export interface IcoordsForm {
  noDms: FormGroup<any | null | undefined>;
  dms: FormGroup<any | null | undefined>;
}
export interface InoDmsForm {
  coords: FormControl<string | null | undefined>;
}
export interface IdmsForm {
  longitude: FormGroup<any | null | undefined>;
  latitude: FormGroup<any | null | undefined>;
}
export interface ILongitudeForm {
  degrees: FormControl<string | null | undefined>;
  minutes: FormControl<string | null | undefined>;
  seconds: FormControl<string | null | undefined>;
  lon: FormControl<any | null | undefined>;
}
export interface ILatitudeForm {
  degrees: FormControl<string | null | undefined>;
  minutes: FormControl<string | null | undefined>;
  seconds: FormControl<string | null | undefined>;
  lat: FormControl<any | null | undefined>;
}


/*Form de visor-navigator (para request de recursos sugeridos)*/
export interface IRecursosForm {
  unitForm: FormGroup<any>;
  radioForm: FormGroup<any>;
}
export interface IUnitForm {
  unit: FormControl<string | null | undefined>;
}
export interface IRadioForm {
  radio: FormControl<number | null | undefined>;
}