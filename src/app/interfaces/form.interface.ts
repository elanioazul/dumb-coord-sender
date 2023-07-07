import { FormGroup, FormControl } from "@angular/forms";
import {ICoordinateSystem } from '../interfaces/coord-system.interfaz';
import {CoordinateSystem } from '../classes/coord-system';
export interface IForm {
  epsgForm: FormGroup<any>;
  coordsForm: FormGroup<any>;
}
export interface IepsgForm {
  epsg: FormControl<number | null | undefined>
}
export interface IcoordsForm {
    noDms: FormGroup<any | null | undefined>;
    dms: FormGroup<any | null | undefined>;
}
export interface InoDmsForm {
    coords: FormControl<string | null | undefined>
}
export interface IdmsForm {
    longitude: FormGroup<any | null | undefined>;
    latitude: FormGroup<any | null | undefined>;
}
export interface ILongitudeForm {
    degrees: FormControl<string | null | undefined>
    minutes: FormControl<string | null | undefined>
    seconds: FormControl<string | null | undefined>
    lon: FormControl<any | null | undefined>
}
export interface ILatitudeForm {
    degrees: FormControl<string | null | undefined>
    minutes: FormControl<string | null | undefined>
    seconds: FormControl<string | null | undefined>
    lat: FormControl<any | null | undefined>
}