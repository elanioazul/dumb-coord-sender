import { Component, OnDestroy, OnInit } from '@angular/core';
import { IRecurso, IResourcesByRadioRes } from '@core/interfaces/reecurso-interfaz';
import { OrsService } from '@core/services/ors.service';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { IOpenRouteServiceRes } from '@core/interfaces/ors.response.interfaz';
import { RecursosService } from '@core/services/recursos.service';
import { Resource } from '@core/classes/resource';
import { RECURSOSCOLUMNS } from '@core/consts/columns-table-recursos';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IRadioForm, IRecursosForm, IUnitForm } from '@core/interfaces/form.interface';
import { LazyLoadEvent } from 'primeng/api';
import { units } from '@core/consts/units-to-request-resources';
import { SidebarService } from '@core/services/sidebar.service';
import Popup from 'ol-ext/overlay/Popup';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Geometry } from 'ol/geom';
import { Map } from 'ol';
import { MapService } from '@core/services/map.service';
import { Coordinate } from 'ol/coordinate';
import { transform4326CoordsToMercatorPoint } from '@core/utils/ol';
@Component({
  selector: 'app-visor-navigator',
  templateUrl: './visor-navigator.component.html',
  styleUrls: ['./visor-navigator.component.scss'],
})
export class VisorNavigatorComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();

  map!: Map;

  recursos!: Resource[];
  columns!: any;
  rows!: number;
  first: number;
  totalRecords!: number;

  loading!: boolean;

  selectedRecurso!: IRecurso;
  highlightedRow!: any;

  distance!: string | undefined;
  time!: string | undefined;

  units = units;
  form!: FormGroup<any>;

  destination!: number[] | null;
  noIncidenteMsg: string = "Introduzca un incidente sobre el que buscar recursos por distancia";
  
  private infoPopup: Popup | null;
  private infoPopupCoords!: Coordinate;
  private infoPopupHtml!: string;

  constructor(
    private orsService: OrsService, 
    private resourcesService: RecursosService,
    private builder: FormBuilder,
    private sidebarService: SidebarService,
    private mapService: MapService
  ) {
    this.first = 0;
    this.rows = 10;
    this.instantiateTable();
    this.initForm();
    this.highlightedRow = this.resourcesService.getSelectedRowElement();
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
              const mediano = this.orsService.findMedian(res.features[0].geometry.coordinates);
              this.infoPopupCoords = transform4326CoordsToMercatorPoint(mediano[0], mediano[1]).getCoordinates();
              this.orsService.setRuta(this.orsService.resourceRoute, res.features[0].geometry);
              this.orsService.setDistance(res.features[0].properties.summary.distance);
              this.orsService.setDuration(res.features[0].properties.summary.duration);
              this.infoPopup.show(this.infoPopupCoords, this.infoPopupHtml);
            });
        }
      });
    this.mapService.maps$
    .pipe(takeUntil(this.destroy$))
    .subscribe((maps) => {
      if (maps.viewer!) {
        this.map = maps.viewer;
        this.createInfoPopup();
        this.orsService.resourceRoute.setMap(this.map);
      }
    });
    combineLatest([this.orsService.distance$, this.orsService.duration$])
    .pipe(takeUntil(this.destroy$))
    .subscribe(([distance, duration]) => {
        this.wrapPopupContent(distance, duration)
    });
  }

  ngOnDestroy(): void {
    this.orsService.removeFeaturesFromRoute(this.orsService.resourceRoute);
    this.orsService.setRecursoToNull();
    this.map?.removeOverlay(this.infoPopup);
    this.orsService.resourceRoute.setMap(null);
    this.destroy$.next();
    this.destroy$.complete();
  }

  wrapPopupContent(distance: string | null, duration: string | null): void {
    this.infoPopupHtml = `Distancia: ${distance}` + '<br/>' + `Duración: ${duration}`
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

  onSelectedResource(recurso: Resource): void {
    const originFeature = this.orsService.getRutaFeatureByType(this.orsService.resourceRoute, 'origin');
    const routeFeature = this.orsService.getRutaFeatureByType(this.orsService.resourceRoute, 'route');
    const features = new Array(originFeature, routeFeature);
    if (originFeature) this.orsService.deleteFeatureFromRouteLayer(this.orsService.resourceRoute, features);
    const arr = new Array(recurso.coordx, recurso.coordy);
    this.orsService.setOrigin(this.orsService.resourceRoute, arr, 'RecursoId ' + (recurso.resourceId).toString());
    const incidentCoords = this.orsService.getIncidente();
    if (incidentCoords)
    this.orsService.setDestination(this.orsService.resourceRoute, incidentCoords);
  }

  onSelectedRow(selectedRowElement: HTMLTableRowElement): void {
    this.resourcesService.setSelectedRowElement(selectedRowElement);
    this.sidebarService.getSidebarInstance()._onCloseClick();

  }

  private createInfoPopup(): void {
    this.infoPopup = new Popup({
      id: 'routePopup',
      popupClass: 'tooltips marginTooltip',
      closeBox: false,
      positioning: 'bottom-auto',
      autoPan: true,
      autoPanAnimation: { duration: 250 },
    });
    this.map.addOverlay(this.infoPopup);
  }
}
