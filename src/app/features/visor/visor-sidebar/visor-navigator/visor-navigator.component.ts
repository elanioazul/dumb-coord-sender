import { Component, OnDestroy, OnInit } from '@angular/core';
import { recursos } from '@core/consts/recursos';
import { IRecurso } from '@core/interfaces/reecurso-interfaz';
import { OrsService } from '@core/services/ors.service';
import { Subject, takeUntil } from 'rxjs';



@Component({
  selector: 'app-visor-navigator',
  templateUrl: './visor-navigator.component.html',
  styleUrls: ['./visor-navigator.component.scss']
})
export class VisorNavigatorComponent implements OnInit, OnDestroy {

  destroy$ = new Subject<void>();

  recursos!: IRecurso[];

  selectedRecurso!: IRecurso;

  distance!: string;
  time!: string

  constructor(private orsService: OrsService) {}

  ngOnInit(): void {
    this.recursos = recursos;

    this.orsService.getLatestRuteDetails$.pipe(takeUntil(this.destroy$)).subscribe(([origin, destination]) => {
      if ((origin && destination) && origin != null && destination != null) {
        this.orsService.getOrsInfo(origin, destination).subscribe((res: any) => {
          this.orsService.setRuta(res.features[0].geometry);
          this.distance = this.convertDistance(res.features[0].properties.summary.distance);
          this.time = this.convertTime(res.features[0].properties.summary.duration);
        });
      }
    })
  }

  selectionChanged(option: any): void {
    const originFeature = this.orsService.getFeatureByType('origin');
    const routeFeature = this.orsService.getFeatureByType('route');
    const features = new Array(originFeature, routeFeature)
    if (originFeature) this.orsService.deleteFeatureFromLayer(features)
    this.orsService.setOrigin(option.value)
  }

  convertTime(seconds: number): string {
    if (isNaN(seconds) || seconds < 0) {
      return "Invalid input";
    }
  
    const hours = (seconds / 3600).toFixed(1);
    const remainingSeconds = seconds % 3600;
    const minutes = (remainingSeconds / 60).toFixed(1);
    const remainingSecondsAfterMinutes = (remainingSeconds % 60).toFixed(1);
  
    const hoursText = parseInt(hours) > 0 ? `${hours} hour${hours !== "1.0" ? 's' : ''}` : '';
    const minutesText = parseInt(minutes) > 0 ? `${minutes} min${minutes !== "1.0" ? 's' : ''}` : '';
    const secondsText = parseInt(remainingSecondsAfterMinutes) > 0 ? `${remainingSecondsAfterMinutes} sec${remainingSecondsAfterMinutes !== "1.0" ? 's' : ''}` : '';
  
    const timeParts = [hoursText, minutesText, secondsText].filter(Boolean);
  
    return timeParts.join(' and ');
  }

  convertDistance(meters: number): string {
    if (isNaN(meters) || meters < 0) {
      return "Invalid input";
    }
  
    const kilometers = (meters / 1000).toFixed(1);
    return `${kilometers} km${kilometers !==  "1.0" ? 's' : ''}`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
