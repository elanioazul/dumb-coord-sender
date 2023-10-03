import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MapService } from '@core/services/map.service';
import { Subject, map, takeUntil } from 'rxjs';
import {
  addMouseControlToMap
} from '@core/utils/ol';;
@Component({
  selector: 'app-visor-notifications-bar',
  templateUrl: './visor-notifications-bar.component.html',
  styleUrls: ['./visor-notifications-bar.component.scss']
})
export class VisorNotificationsBarComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('coordinates') private coordinatesDiv!: ElementRef<HTMLDivElement>;

  map!: any;

  private unSubscribe = new Subject<void>();

  constructor(private mapService:MapService) {}

  ngOnInit(): void {
    this.mapService.maps$
      .pipe(
        takeUntil(this.unSubscribe),
        //map((maps) => maps.viewer?.getControls().get('MousePosition').setTarget(this.coordinatesDiv.nativeElement))
      )
      .subscribe((maps) => {
      this.map = maps.viewer;
      
    });
  }
  ngAfterViewInit(): void {
    //this.map.getControls().MousePosition.setTarget(this.coordinatesDiv.nativeElement);
    //this.map.getControls().getArray()[2].setTarget(this.coordinatesDiv);
    addMouseControlToMap(this.coordinatesDiv.nativeElement, this.map);
  }

  ngOnDestroy(): void {
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }


}
