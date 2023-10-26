import { Component, OnDestroy, OnInit } from '@angular/core';
import { recursos } from '@core/consts/recursos';
import { IRecurso } from '@core/interfaces/reecurso-interfaz';
import { OrsService } from '@core/services/ors.service';
import { Subject, takeUntil } from 'rxjs';
import { IOpenRouteServiceRes } from '@core/interfaces/ors.response.interfaz';
@Component({
  selector: 'app-visor-navigator',
  templateUrl: './visor-navigator.component.html',
  styleUrls: ['./visor-navigator.component.scss'],
})
export class VisorNavigatorComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();

  recursos!: IRecurso[];

  selectedRecurso!: IRecurso;

  distance!: string;
  time!: string;

  constructor(private orsService: OrsService) {}

  ngOnInit(): void {
    this.recursos = recursos;

    this.orsService.getLatestRuteDetails$
      .pipe(takeUntil(this.destroy$))
      .subscribe(([origin, destination]) => {
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

  selectionChanged(option: any): void {
    const originFeature = this.orsService.getRutaFeatureByType('origin');
    const routeFeature = this.orsService.getRutaFeatureByType('route');
    const features = new Array(originFeature, routeFeature);
    if (originFeature) this.orsService.deleteFeatureFromRouteLayer(features);
    const selectedResourceName = this.recursos.find(
      (recurso: IRecurso) =>
        true == this.arraysAreEqual(recurso.coordinates, option.value)
    )?.name;
    if (selectedResourceName)
    this.orsService.setOrigin(option.value, selectedResourceName);
  }

  private arraysAreEqual(arr1: any[], arr2: any[]): boolean {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  }
}
