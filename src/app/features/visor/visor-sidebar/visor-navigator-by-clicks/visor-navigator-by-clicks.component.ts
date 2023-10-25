import { Component, OnDestroy, OnInit } from '@angular/core';
import { MapService } from '@core/services/map.service';
import { OrsService } from '@core/services/ors.service';
import { transformMercatorCoordsTo4326Point } from '@core/utils/ol';
import { Map } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { Subject, takeUntil } from 'rxjs';
import { IOpenRouteServiceRes } from '@core/interfaces/ors.response.interfaz';
@Component({
  selector: 'app-visor-navigator-by-clicks',
  templateUrl: './visor-navigator-by-clicks.component.html',
  styleUrls: ['./visor-navigator-by-clicks.component.scss']
})
export class VisorNavigatorByClicksComponent implements OnInit, OnDestroy {
  private unSubscribe = new Subject<void>();
  map!: Map;

  start!: Coordinate | null;
  end!: Coordinate | null;

  constructor(private orsService: OrsService, private mapService: MapService){}

  ngOnInit(): void {
    this.mapService.maps$
    .pipe(takeUntil(this.unSubscribe))
    .subscribe((maps) => {
      if (maps.viewer!) {
        this.map = maps.viewer;
        // this.tooltip = new Tooltip({
        //   formatArea: this.formatArea,
        //   formatLength: this.formatLength,
        // });
        // this.map.addOverlay(this.tooltip);
        // this.createCoordsPopup();
        this.setClickEvent();
        //this.measuringLayer.setMap(this.map);
      }
    });
  }

  ngOnDestroy(): void {
    this.unSubscribe.next();
    this.unSubscribe.complete();
    this.orsService.removeFeaturesFromRouteByClicks();
    this.orsService.setStartPointToNull();
    this.start = null;
    this.orsService.setEndPointToNull();
    this.end = null;
    this.map.un('click', this.clickEventHandler);
  }

  private setClickEvent(): void {
    this.map.on('click'/*dblclick*/, this.clickEventHandler);
  }

  private clickEventHandler = (e) => {
    if (this.orsService.getStartPoint() !== null && this.orsService.getEndPoint() !== null) {
      this.orsService.setStartPointToNull();
      this.start = null;
      this.orsService.setEndPointToNull();
      this.end = null;
      this.orsService.removeFeaturesFromRouteByClicks();
    }
    if (this.orsService.getStartPoint() == null) {
      const point = transformMercatorCoordsTo4326Point(e.coordinate[0], e.coordinate[1])
      this.orsService.loadStartPoint(point.getCoordinates());
      this.start = point.getCoordinates();
    } else if (this.orsService.getEndPoint() == null) {
      const point = transformMercatorCoordsTo4326Point(e.coordinate[0], e.coordinate[1])
      this.orsService.loadEndPoint(point.getCoordinates());
      this.end = point.getCoordinates();
    }
    if (this.start && this.end)
    this.callService()
  }

  private callService(): void {
    if (this.start !== null && this.end !== null)
      this.orsService
        .getOrsInfo(this.start, this.end)
        .subscribe((res: IOpenRouteServiceRes) => {
          this.orsService.setRutaByClicks(res.features[0].geometry);
        });
  }


}
