import { Component, OnDestroy, OnInit } from '@angular/core';
import { MapService } from '@core/services/map.service';
import { OrsService } from '@core/services/ors.service';
import { transformMercatorCoordsTo4326Point, transform4326CoordsToMercatorPoint } from '@core/utils/ol';
import { Map, Feature, Collection } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { IOpenRouteServiceRes } from '@core/interfaces/ors.response.interfaz';
import Modify from 'ol/interaction/Modify.js';
import { ILayers } from '@core/interfaces/layers.interfaz';
import Popup from 'ol-ext/overlay/Popup';
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

  modification!: Modify;
  layers: ILayers;

  private infoPopup: Popup | null;
  private infoPopupCoords!: Coordinate;
  private infoPopupHtml!: string;


  constructor(private orsService: OrsService, private mapService: MapService){
    this.layers = this.mapService.getAllLayers();
  }

  ngOnInit(): void {
    this.mapService.maps$
    .pipe(takeUntil(this.unSubscribe))
    .subscribe((maps) => {
      if (maps.viewer!) {
        this.map = maps.viewer;
        this.createInfoPopup();
        this.setClickEvent();
      }
    });
    combineLatest([this.orsService.distance$, this.orsService.duration$])
    .pipe(takeUntil(this.unSubscribe))
    .subscribe(([distance, duration]) => {
        this.wrapPopupContent(distance, duration)
    });
  }

  wrapPopupContent(distance: string | null, duration: string | null): void {
    this.infoPopupHtml = `Distancia: ${distance}` + '<br/>' + `Duración: ${duration}`
  }

  ngOnDestroy(): void {
    this.unSubscribe.next();
    this.unSubscribe.complete();
    this.orsService.removeFeaturesFromRouteByClicks();
    this.orsService.setStartPointToNull();
    this.start = null;
    this.orsService.setEndPointToNull();
    this.end = null;
    this.removeClickEvent();
    this.removeModifyInteraction();
    this.map?.removeOverlay(this.infoPopup);
  }

  private removeClickEvent(): void {
    this.map.un('click', this.clickEventHandler);
  }

  private removeModifyInteraction(): void {
    (this.layers.routeByClicks?.getLayers() as any).getArray()[0].getSource().un('modifystart', this.onModifyStart);
    (this.layers.routeByClicks?.getLayers() as any).getArray()[0].getSource().un('modifyend', this.onModifyEnd);
  }

  private onModifyStart = (): void => {
    console.log('displacement started by dragging');
    return;
    
  }
  private onModifyEnd = (e: any): void => {
    const targets = e.target;
    if (targets) {
      const features = targets.features_.array_;

      const startFeatCoord = features.find((feat: Feature) => feat.getId() === 'start-point').getGeometry().getCoordinates();
      const endFeatCoord = features.find((feat: Feature) => feat.getId() === 'end-point').getGeometry().getCoordinates();
      
      const newStrt = transformMercatorCoordsTo4326Point(startFeatCoord[0], startFeatCoord[1]);
      const newEnd = transformMercatorCoordsTo4326Point(endFeatCoord[0], endFeatCoord[1]);
  
      this.orsService.removeFeaturesFromRouteByClicks();

      this.orsService.loadStartPoint(newStrt.getCoordinates());
      this.orsService.loadEndPoint(newEnd.getCoordinates());
      this.start = newStrt.getCoordinates();
      this.end = newEnd.getCoordinates();

      this.callService();
    } else {
      return
    }

  }

  private addModifyInteraction(): void {
    const collection = this.determineFeaturesToBeModified();
    this.modification = new Modify({features: collection})
    this.map.addInteraction(this.modification);
    this.modification.on('modifystart', this.onModifyStart)
    this.modification.on('modifyend', this.onModifyEnd)
  }

  private determineFeaturesToBeModified(): Collection<Feature> {
    return new Collection([this.orsService.getRutaByclicksFeatureByType('start-point'), this.orsService.getRutaByclicksFeatureByType('end-point')]);
  }

  private setClickEvent(): void {
    this.map.on('click'/*dblclick*/, this.clickEventHandler);
  }

  private createInfoPopup(): void {
    this.infoPopup = new Popup({
      id: 'routeByClicksPopup',
      popupClass: 'tooltips marginTooltip',
      closeBox: false,
      positioning: 'bottom-auto',
      autoPan: true,
      autoPanAnimation: { duration: 250 },
    });
    this.map.addOverlay(this.infoPopup);
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
    if (this.start && this.end) {
      this.callService()
      this.addModifyInteraction()
    }
  }

  private callService(): void {
    if (this.start !== null && this.end !== null)
      this.orsService
        .getOrsInfo(this.start, this.end)
        .pipe(takeUntil(this.unSubscribe))
        .subscribe((res: IOpenRouteServiceRes) => {
          const mediano = this.orsService.findMedian(res.features[0].geometry.coordinates);
          this.infoPopupCoords = transform4326CoordsToMercatorPoint(mediano[0], mediano[1]).getCoordinates();
          this.orsService.setRutaByClicks(res.features[0].geometry);
          this.orsService.setDistance(res.features[0].properties.summary.distance);
          this.orsService.setDuration(res.features[0].properties.summary.duration);
          this.infoPopup.show(this.infoPopupCoords, this.infoPopupHtml);
        });
  }


}
