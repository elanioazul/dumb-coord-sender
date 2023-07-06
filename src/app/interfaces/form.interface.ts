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
    degrees: FormControl<number | null | undefined>
    minutes: FormControl<number | null | undefined>
    seconds: FormControl<number | null | undefined>
    lon: FormControl<any | null | undefined>
}
export interface ILatitudeForm {
    degrees: FormControl<number | null | undefined>
    minutes: FormControl<number | null | undefined>
    seconds: FormControl<number | null | undefined>
    lat: FormControl<any | null | undefined>
}