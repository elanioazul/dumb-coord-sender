import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoordinateSystem } from '@core/classes/coord-system';
import { latitudeValues, longitudeValues } from '@core/consts/lat-lon-vals';
import { IForm, ILatitudeForm, ILongitudeForm, IcoordsForm, IdmsForm, IepsgForm, InoDmsForm } from '@core/interfaces/form.interface';
import { ITransformPayload } from '@core/interfaces/payload.interface';
import { CoordinatesService } from '@core/services/coordinates.service';
import { MapService } from '@core/services/map.service';
import { OrsService } from '@core/services/ors.service';
import { MessageService } from 'primeng/api';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { Map } from 'ol';
import { flyToPosition, transformPointToMercatorFeature } from '@core/utils/ol';
@Component({
  selector: 'app-visor-search-by-coord',
  templateUrl: './visor-search-by-coord.component.html',
  styleUrls: ['./visor-search-by-coord.component.scss'],
})
export class VisorSearchByCoordComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  subscriptions: Subscription[] = [];

  form!: FormGroup<any>;
  selectedEpsg!: number;

  coordSystemsOptions!: CoordinateSystem[];

  latitudeValues = latitudeValues;
  longitudeValues = longitudeValues;

  map!: Map;
  
  constructor(
    private coordService: CoordinatesService,
    private builder: FormBuilder,
    private mapService: MapService,
    private orsService: OrsService,
    private messageService: MessageService,
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

  onSubmit(): void {
    const formValue = this.form.getRawValue();
    let payload: ITransformPayload;
    if (this.checkDmsMode()) {
      payload = this.adaptPayloadForDms(formValue);
    } else {
      payload = this.adaptPayloadForNoDms(formValue);
    }

    this.coordService.sendCoordToTransform(payload).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.handleTransformResponse(data);
    });
  }

  handleTransformResponse(data: any): void {
    const res = JSON.parse(data.body);


    const point: any = JSON.parse(res.transformed_point.geojson);

    const cooidSystemId = this.coordSystemsOptions.find(
      (system) => system.epsgVal == res.transformed_point.srid
    )?.id;

    if (res.initial_point && res.transformed_point && cooidSystemId) {
      this.addfeatureToMap(point, cooidSystemId);
      this.messageService.add({
        summary: 'Éxito',
        detail: `Coordendadas transformadas con exito.`,
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
  addfeatureToMap(point: any, sridId: number) {
    this.subscriptions.push(
      this.mapService.maps$.subscribe((maps) => {
        this.map = maps.overview!;
        const feature = transformPointToMercatorFeature(
          sridId,
          point.coordinates[0],
          point.coordinates[1]
        );
        //this.mapService.addFeature('incident', feature);
        //this.mapService.addFeature('incidents', feature);
        this.orsService.setDestination(point.coordinates);
        flyToPosition(this.map, point.coordinates[1], point.coordinates[0])
      })
    );
  }
}
