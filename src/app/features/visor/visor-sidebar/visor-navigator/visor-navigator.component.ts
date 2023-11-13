import { Component, OnDestroy, OnInit } from '@angular/core';
import { IRecurso, IResourcesByRadioRes } from '@core/interfaces/reecurso-interfaz';
import { OrsService } from '@core/services/ors.service';
import { Subject, takeUntil } from 'rxjs';
import { IOpenRouteServiceRes } from '@core/interfaces/ors.response.interfaz';
import { RecursosService } from '@core/services/recursos.service';
import { Resource } from '@core/classes/resource';
import { RECURSOSCOLUMNS } from '@core/consts/columns-table-recursos';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IRadioForm, IRecursosForm, IUnitForm } from '@core/interfaces/form.interface';
import { LazyLoadEvent } from 'primeng/api';
import { units } from '@core/consts/units-to-request-resources';
@Component({
  selector: 'app-visor-navigator',
  templateUrl: './visor-navigator.component.html',
  styleUrls: ['./visor-navigator.component.scss'],
})
export class VisorNavigatorComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();

  recursos!: Resource[];
  columns!: any;
  rows!: number;
  first: number;
  totalRecords!: number;

  loading!: boolean;

  selectedRecurso!: IRecurso;
  selectedRow!: any;

  distance!: string | undefined;
  time!: string | undefined;

  units = units;
  form!: FormGroup<any>;

  destination!: number[] | null;
  noIncidenteMsg: string = "Introduzca un incidente sobre el que buscar recursos por distancia";

  constructor(
    private orsService: OrsService, 
    private resourcesService: RecursosService,
    private builder: FormBuilder
  ) {
    this.first = 0;
    this.rows = 10;
    this.instantiateTable();
    this.initForm();
    this.selectedRow = this.resourcesService.getSelectedRowElement();
  }

  initForm(): void {
    const found = this.units.find((unit: any) => unit.name === this.resourcesService.getRequestedUnit())?.name;
    if (found)
    this.form = this.builder.group<IRecursosForm>({
      unitForm: this.builder.group<IUnitForm>({
        unit: this.builder.control(found, Validators.required)
      }),
      radioForm: this.builder.group<IRadioForm>({
        radio: this.builder.control(this.resourcesService.getRequestedDistance(), Validators.required)
      })
    })
  }
  
  instantiateTable(): void {
    this.columns = RECURSOSCOLUMNS;
    this.bringData();
  }

  updateTable(data: IResourcesByRadioRes): void {
    this.recursos = data.content;
    this.first = data.pageable.number * 10;
    this.rows = data.pageable.size;
    this.totalRecords = data.pageable.totalElements;
  }

  ngOnInit(): void {
    this.orsService.getLatestRuteDetails$
      .pipe(takeUntil(this.destroy$))
      .subscribe(([origin, destination]) => {
        this.destination = destination;
        if (origin && destination && origin != null && destination != null) {
          this.orsService
            .getOrsInfo(origin, destination)
            .subscribe((res: IOpenRouteServiceRes) => {
              this.orsService.setRuta(res.features[0].geometry);
              this.distance = this.orsService.convertDistance(
                res.features[0].properties.summary.distance
              );
              this.time = this.orsService.convertTime(
                res.features[0].properties.summary.duration
              );
            });
        }
      });
  }

  ngOnDestroy(): void {
    this.orsService.removeFeaturesFromRoute();
    this.orsService.setRecursoToNull();
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    this.loading = true;
    this.distance = undefined;
    this.time = undefined;
    const formValue = this.form.getRawValue();
    this.resourcesService.setRequestedDistance(formValue.radioForm.radio);
    this.resourcesService.setRequestedUnit(formValue.unitForm.unit);
    this.first = 0;
    this.bringData();
    
  }

  bringData(event?: LazyLoadEvent): void {
    this.loading = true;
    this.first = event?.first? event.first : 0;
    const first = this.first ? this.first / 10 : this.first;
    this.resourcesService.getResourcesByRadio(first, this.rows).subscribe((data: IResourcesByRadioRes) => {
      this.updateTable(data)
      this.loading = false;
    });
  }

  onSelectedActuation(recurso: Resource): void {
    const originFeature = this.orsService.getRutaFeatureByType('origin');
    const routeFeature = this.orsService.getRutaFeatureByType('route');
    const features = new Array(originFeature, routeFeature);
    if (originFeature) this.orsService.deleteFeatureFromRouteLayer(features);
    const arr = new Array(recurso.coordx, recurso.coordy);
    this.orsService.setOrigin(arr, 'RecursoId ' + (recurso.resourceId).toString());
    const incidentCoords = this.orsService.getIncidente();
    if (incidentCoords)
    this.orsService.setDestination(incidentCoords);
  }

  onSelectedRow(selectedRowElement: any): void {
    this.resourcesService.setSelectedRowElement(selectedRowElement)
  }

  private arraysAreEqual(arr1: any[], arr2: any[]): boolean {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  }
}
