import { Component, OnDestroy, OnInit } from '@angular/core';
import { MapService } from '@core/services/map.service';
import { OrsService } from '@core/services/ors.service';
import { transformMercatorCoordsTo4326Point, transform4326CoordsToMercatorPoint } from '@core/utils/ol';
import { Map, Feature, Collection } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { Subject, combineLatest, find, takeUntil } from 'rxjs';
import { IOpenRouteServiceRes, IRaymondOpenRouteServiceRes } from '@core/interfaces/ors.response.interfaz';
import Modify from 'ol/interaction/Modify.js';
import Popup from 'ol-ext/overlay/Popup';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Geometry } from 'ol/geom';
@Component({
  selector: 'app-visor-navigator-by-clicks',
  templateUrl: './visor-navigator-by-clicks.component.html',
  styleUrls: ['./visor-navigator-by-clicks.component.scss']
})
export class VisorNavigatorByClicksComponent implements OnInit, OnDestroy {
  private unSubscribe = new Subject<void>();
  map!: Map;

  routeByClicksLayer!: VectorLayer<VectorSource<Geometry>>;
  routeByClicksLayerId = 'routeByClicks'

  start!: Coordinate | null;
  end!: Coordinate | null;

  modification!: Modify;

  private infoPopup: Popup | null;
  private infoPopupCoords!: Coordinate;
  private infoPopupHtml!: string;


  constructor(private orsService: OrsService, private mapService: MapService){
    this.routeByClicksLayer = new VectorLayer({
      source: new VectorSource()
    });
    this.routeByClicksLayer.setProperties({id: this.routeByClicksLayerId})
  }

  ngOnInit(): void {
    this.mapService.maps$
    .pipe(takeUntil(this.unSubscribe))
    .subscribe((maps) => {
      if (maps.viewer!) {
        this.map = maps.viewer;
        this.createInfoPopup();
        this.setClickEvent();
        this.routeByClicksLayer.setMap(this.map);
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
    this.orsService.removeFeaturesFromRouteByClicks(this.routeByClicksLayer);
    this.orsService.setStartPointToNull();
    this.start = null;
    this.orsService.setEndPointToNull();
    this.end = null;
    this.removeClickEvent();
    this.removeModifyInteraction();
    this.map?.removeOverlay(this.infoPopup);
    this.routeByClicksLayer.setMap(null);
  }

  private removeClickEvent(): void {
    this.map.un('click', this.clickEventHandler);
  }

  private removeModifyInteraction(): void {
    const found: any = this.map.getLayers().getArray().find((lay: any) => lay.getProperties().id === this.routeByClicksLayerId);
    found?.getSource().un('modifystart', this.onModifyStart);
    found?.getSource().un('modifyend', this.onModifyEnd);
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
  
      this.orsService.removeFeaturesFromRouteByClicks(this.routeByClicksLayer);

      this.orsService.loadStartPoint(this.routeByClicksLayer, newStrt.getCoordinates());
      this.orsService.loadEndPoint(this.routeByClicksLayer, newEnd.getCoordinates());
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
    return new Collection([this.orsService.getRutaByclicksFeatureByType(this.routeByClicksLayer, 'start-point'), this.orsService.getRutaByclicksFeatureByType(this.routeByClicksLayer, 'end-point')]);
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
      this.orsService.removeFeaturesFromRouteByClicks(this.routeByClicksLayer);
    }
    if (this.orsService.getStartPoint() == null) {
      const point = transformMercatorCoordsTo4326Point(e.coordinate[0], e.coordinate[1])
      this.orsService.loadStartPoint(this.routeByClicksLayer, point.getCoordinates());
      this.start = point.getCoordinates();
    } else if (this.orsService.getEndPoint() == null) {
      const point = transformMercatorCoordsTo4326Point(e.coordinate[0], e.coordinate[1])
      this.orsService.loadEndPoint(this.routeByClicksLayer, point.getCoordinates());
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
        //.getOrsInfo(this.start, this.end)
        .getOrsInfoRaymond(this.start, this.end, '4326')
        .pipe(takeUntil(this.unSubscribe))
        // .subscribe((res: IOpenRouteServiceRes) => {
        //   const mediano = this.orsService.findMedian(res.features[0].geometry.coordinates);
        //   this.infoPopupCoords = transform4326CoordsToMercatorPoint(mediano[0], mediano[1]).getCoordinates();
        //   this.orsService.setRutaByClicks(this.routeByClicksLayer, res.features[0].geometry);
        //   this.orsService.setDistance(res.features[0].properties.summary.distance);
        //   this.orsService.setDuration(res.features[0].properties.summary.duration);
        //   this.infoPopup.show(this.infoPopupCoords, this.infoPopupHtml);
        // });
        .subscribe((res: IRaymondOpenRouteServiceRes) => {
          const mediano = this.orsService.findMedian(res.routePath);
          this.infoPopupCoords = transform4326CoordsToMercatorPoint(mediano[0], mediano[1]).getCoordinates();
          this.orsService.setRutaByClicks(this.routeByClicksLayer, res.routePath);
          this.orsService.setDistance(res.routeDistance);
          this.orsService.setDuration(res.routeTime);
          this.infoPopup.show(this.infoPopupCoords, this.infoPopupHtml);
        });
  }


}
