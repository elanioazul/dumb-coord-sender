import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CoordinatesService } from '../../core/services/coordinates.service';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import {
  EMPTY,
  Observable,
  Subject,
  Subscription,
  catchError,
  takeUntil,
} from 'rxjs';
import { CoordinateSystem } from '../../core/classes/coord-system';
import { MessageService } from 'primeng/api';
import {
  IForm,
  IepsgForm,
  IcoordsForm,
  InoDmsForm,
  IdmsForm,
  ILongitudeForm,
  ILatitudeForm,
} from '../../core/interfaces/form.interface';
import { CoordinateInitial } from '../../core/classes/coord-initial';
import { CoordinateTransformed } from '../../core/classes/coord-transformed';
import {
  ICheckAbsPayload,
  ITransformPayload,
} from '../../core/interfaces/payload.interface';
import {
  latitudeValues,
  longitudeValues,
} from '../../core/consts/lat-lon-vals';
import { MapService } from 'src/app/core/services/map.service';
import { Feature, Map } from 'ol';
import { transformPointToFeature, flyToPosition } from '../../core/utils/ol';
import { AbsService } from 'src/app/core/services/abs.service';
import { AdmincapasService } from 'src/app/core/services/admincapas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  @ViewChild('container') topScrollTarget!: ElementRef;

  latitudeValues = latitudeValues;
  longitudeValues = longitudeValues;

  destroy$ = new Subject<void>();
  subscriptions: Subscription[] = [];

  coordSystemsOptions!: CoordinateSystem[];
  selectedEpsg!: number;

  errorMessage = '';

  map!: Map;

  form!: FormGroup<any>;

  visible = false;

  abs!: any;
  adminInfo!: any;

  initialCoordsTable$ = this.coordService.getInitialCoordList$.pipe(
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
    })
  );
  transformedlCoordsTable$ = this.coordService.getTransformedCoordList$.pipe(
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  constructor(
    private coordService: CoordinatesService,
    private absService: AbsService,
    private capasService: AdmincapasService,
    private builder: FormBuilder,
    private messageService: MessageService,
    private mapService: MapService,
    private router: Router
  ) {
    this.form = this.builder.group<IForm>({
      epsgForm: this.builder.group<IepsgForm>({
        epsg: this.builder.control(0, Validators.required),
      }),
      coordsForm: this.builder.group<IcoordsForm>({
        noDms: this.builder.group<InoDmsForm>({
          coords: this.builder.control('', Validators.required),
        }),
        dms: this.builder.group<IdmsForm>({
          longitude: this.builder.group<ILongitudeForm>({
            degrees: this.builder.control('0', Validators.required),
            minutes: this.builder.control('0', Validators.required),
            seconds: this.builder.control('0', Validators.required),
            lon: this.builder.control(0, Validators.required),
          }),
          latitude: this.builder.group<ILatitudeForm>({
            degrees: this.builder.control('0', Validators.required),
            minutes: this.builder.control('0', Validators.required),
            seconds: this.builder.control('0', Validators.required),
            lat: this.builder.control(0, Validators.required),
          }),
        }),
      }),
    });
    this.form.get('epsgForm.epsg')?.valueChanges.subscribe((data) => {
      this.selectedEpsg = data;
      if (data !== null) {
        if (data == 1 || data == 6) {
          this.enableDmsPart();
          this.disableNoDmsPart();
        } else {
          this.enableNoDmsPart();
          this.disableDmsPart();
        }
        this.form.markAsUntouched();
      }
    });
  }

  disableNoDmsPart(): void {
    this.form.get('coordsForm.noDms')?.reset();
    this.form.get('coordsForm.noDms')?.disable();
  }
  disableDmsPart(): void {
    this.form.get('coordsForm.dms')?.reset();
    this.form.get('coordsForm.dms')?.disable();
  }

  enableNoDmsPart(): void {
    this.form.get('coordsForm.noDms')?.enable();
  }
  enableDmsPart(): void {
    this.form.get('coordsForm.dms')?.enable();
  }

  ngOnInit(): void {
    this.coordService.getCoordSystems$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.coordSystemsOptions = data;
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkDmsMode(): boolean {
    return this.selectedEpsg == 1 || this.selectedEpsg == 6 ? true : false;
  }

  adaptPayloadForNoDms(form: any): ITransformPayload {
    let payload: ITransformPayload;
    delete form.coordsForm.dms;
    return (payload = {
      epsgSelected: this.coordSystemsOptions.find(
        (system) => system.id == form.epsgForm.epsg
      )?.epsgVal,
      coords: form.coordsForm.noDms.coords,
    });
  }

  adaptPayloadForDms(form: any): ITransformPayload {
    let payload: ITransformPayload;
    delete form.coordsForm.noDms;
    return (payload = {
      epsgSelected: this.coordSystemsOptions.find(
        (system) => system.id == form.epsgForm.epsg
      )?.epsgVal,
      coords: [
        [
          form.coordsForm.dms.longitude.degrees,
          form.coordsForm.dms.longitude.minutes,
          form.coordsForm.dms.longitude.seconds,
          form.coordsForm.dms.longitude.lon,
        ],
        [
          form.coordsForm.dms.latitude.degrees,
          form.coordsForm.dms.latitude.minutes,
          form.coordsForm.dms.latitude.seconds,
          form.coordsForm.dms.latitude.lat,
        ],
      ],
    });
  }

  handleTransformResponse(data: any): void {
    const res = JSON.parse(data.body);


    const point: any = JSON.parse(res.transformed_point.geojson);

    const cooidSystemId = this.coordSystemsOptions.find(
      (system) => system.epsgVal == res.transformed_point.srid
    )?.id;

    if (res.initial_point && res.transformed_point && cooidSystemId) {
      this.initOverviewMap(point, cooidSystemId);
      this.messageService.add({
        summary: 'Éxito',
        detail: `Coordendadas transformadas con exito. Recarge la página.`,
        severity: 'success',
      });
    } else {
      this.messageService.add({
        summary: 'Error',
        detail: `Ha habido un error transformando las coordendas`,
        severity: 'error',
      });
    }
  }

  onSubmit(): void {
    const formValue = this.form.getRawValue();
    let payload: ITransformPayload;
    if (this.checkDmsMode()) {
      payload = this.adaptPayloadForDms(formValue);
    } else {
      payload = this.adaptPayloadForNoDms(formValue);
    }

    this.coordService.sendCoordToTransform(payload).subscribe((data) => {
      this.handleTransformResponse(data);
    });
  }

  initOverviewMap(point: any, sridId: number): void {
    this.subscriptions.push(
      this.mapService.maps$.subscribe((maps) => {
        this.map = maps.overview!;
        const feature = transformPointToFeature(
          sridId,
          point.coordinates[0],
          point.coordinates[1]
        );
        this.mapService.addFeature('coordinate', feature);
        this.mapService.addFeature('coordinates', feature);
        this.router.navigate(['/', 'visor-page']);
        flyToPosition(this.map, point.coordinates[1], point.coordinates[0])
      })
    );
  }

  handleAbsResponse(data: any): void {
    const res = JSON.parse(data.body);
    if (res && res[0]) {
      this.abs = res[0];
      this.visible = true;
    } else {
      this.topScrollTarget.nativeElement.scrollIntoView({ behavior: 'smooth' });
      this.messageService.add({
        summary: 'Error',
        detail: `No se ha encontrado info de ABS`,
        severity: 'error',
      });
    }
  }
  handleCapasResponse(data: any): void {
    const res = JSON.parse(data.body);
    if (res && res.country) {
      this.adminInfo = res;
      this.visible = true;
    } else {
      this.topScrollTarget.nativeElement.scrollIntoView({ behavior: 'smooth' });
      this.messageService.add({
        summary: 'Error',
        detail: `No se ha encontrado info administrativa: gap topológico o agua`,
        severity: 'error',
      });
    }
  }

  createAbsIntersectionPayload(
    coord: CoordinateInitial | CoordinateTransformed
  ): ICheckAbsPayload {
    let payload: ICheckAbsPayload;
    return (payload = {
      epsg: this.coordSystemsOptions.find(
        (system) => system.id == parseInt(coord.srid)
      )?.epsgVal,
      lon: coord.longitude,
      lat: coord.latitude,
    });
  }
  createCapasIntersectionPayload(
    coord: CoordinateInitial | CoordinateTransformed
  ): ICheckAbsPayload {
    let payload: ICheckAbsPayload;
    return (payload = {
      epsg: this.coordSystemsOptions.find(
        (system) => system.id == parseInt(coord.srid)
      )?.epsgVal,
      lon: coord.longitude,
      lat: coord.latitude,
    });
  }

  checkABS(coord: CoordinateInitial | CoordinateTransformed): void {
    let payload = this.createAbsIntersectionPayload(coord);
    this.absService.intersectAbs(payload).subscribe((data) => {
      this.handleAbsResponse(data);
    });
  }

  checkAdminInfo(coord: CoordinateInitial | CoordinateTransformed): void {
    let payload = this.createCapasIntersectionPayload(coord);
    this.capasService.intersectCapas(payload).subscribe((data) => {
      this.handleCapasResponse(data);
    });
  }
}
