import { Component, OnDestroy, OnInit } from '@angular/core';
import { CoordinatesService } from '../../services/coordinates.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { EMPTY, Observable, Subject, Subscription, catchError, takeUntil } from 'rxjs';
import { CoordinateSystem } from '../../classes/coord-system';
import { MessageService } from 'primeng/api';
import {IForm, IepsgForm, IcoordsForm, InoDmsForm, IdmsForm, ILongitudeForm, ILatitudeForm}  from '../../interfaces/form.interface';

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
interface IPayload {
  epsgSelected?: number;
  coords: Array<INoDms> | Array<Array<IDms>>

}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {
  latitudeValues = [
    {
      name: "Norte",
      key: "N"
    },
    {
      name: "Sur",
      key: "S"
    },
  ];
  longitudeValues = [
    {
      name: "Este",
      key: "E"
    },
    {
      name: "Oeste",
      key: "O"
    },
  ];

  destroy$ = new Subject<void>();
  subscriptions: Subscription[] = [];

  coordSystemsOptions!: CoordinateSystem[];
  selectedEpsg!: number;

  errorMessage = '';

  form!: FormGroup<any>;

  initialCoordsTable$ = this.coordService.getInitialCoordList$
  .pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  )
  transformedlCoordsTable$ = this.coordService.getTransformedCoordList$
  .pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  )

  constructor(private coordService: CoordinatesService, private builder: FormBuilder, private messageService: MessageService){
    this.form = this.builder.group<IForm>({
      epsgForm: this.builder.group<IepsgForm>({
        epsg: this.builder.control(0, Validators.required)
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
            lon: this.builder.control(0, Validators.required)
          }),
          latitude: this.builder.group<ILatitudeForm>({
            degrees: this.builder.control('0', Validators.required),
            minutes: this.builder.control('0', Validators.required),
            seconds: this.builder.control('0', Validators.required),
            lat: this.builder.control(0, Validators.required)
          })
        })
      })
    });
    this.form.get("epsgForm.epsg")?.valueChanges.subscribe(data => {
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
    })
  }

  disableNoDmsPart(): void {
    this.form.get("coordsForm.noDms")?.reset();
    this.form.get("coordsForm.noDms")?.disable();
  }
  disableDmsPart(): void {
    this.form.get("coordsForm.dms")?.reset();
    this.form.get("coordsForm.dms")?.disable();
  }

  enableNoDmsPart(): void {
    this.form.get("coordsForm.noDms")?.enable();
  }
  enableDmsPart(): void {
    this.form.get("coordsForm.dms")?.enable();
  }

  ngOnInit(): void {
    this.coordService.getCoordSystems$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.coordSystemsOptions = data
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkDmsMode(): boolean {
    return this.selectedEpsg == 1 || this.selectedEpsg == 6 ? true : false;
  }

  adaptPayloadForNoDms(form: any): IPayload {
    let payload: IPayload;
    delete form.coordsForm.dms
    return payload = {
      epsgSelected: this.coordSystemsOptions.find(system => system.id == form.epsgForm.epsg)?.epsgVal,
      coords: form.coordsForm.noDms.coords
    } 
  }

  adaptPayloadForDms(form: any): IPayload {
    let payload: IPayload;
    delete form.coordsForm.noDms;
    return payload = {
      epsgSelected: this.coordSystemsOptions.find(system => system.id == form.epsgForm.epsg)?.epsgVal,
      coords: [
        [form.coordsForm.dms.longitude.degrees, form.coordsForm.dms.longitude.minutes, form.coordsForm.dms.longitude.seconds, form.coordsForm.dms.longitude.lon], 
        [form.coordsForm.dms.latitude.degrees, form.coordsForm.dms.latitude.minutes, form.coordsForm.dms.latitude.seconds, form.coordsForm.dms.latitude.lat]
      ]
    }
  }

  handleResponse(data: any): void {
    const res = JSON.parse(data.body); 
    console.log(res);
    console.log(JSON.parse(res.transformed_point.geojson));
    
    if (res.initial_point && res.transformed_point) {
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
    let payload: IPayload;
    if (this.checkDmsMode()) {
      payload = this.adaptPayloadForDms(formValue);
    } else {
      payload = this.adaptPayloadForNoDms(formValue);
    }
  
    this.coordService.sendCoordToTransform(payload).subscribe((data) => {
      this.handleResponse(data);
    })
  }
}

