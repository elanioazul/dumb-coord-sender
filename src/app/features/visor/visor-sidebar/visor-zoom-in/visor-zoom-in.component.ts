import { Component, OnDestroy, OnInit } from '@angular/core';
import DragBox from 'ol/interaction/DragBox.js';
import { Map } from 'ol';
import { Subject, takeUntil } from 'rxjs';
import { MapService } from '@core/services/map.service';
@Component({
  selector: 'app-visor-zoom-in',
  templateUrl: './visor-zoom-in.component.html',
  styleUrls: ['./visor-zoom-in.component.scss']
})
export class VisorZoomInComponent implements OnInit, OnDestroy {
  private unSubscribe = new Subject<void>();

  map!: Map;

  zoomInInteraction;

  constructor(private mapService: MapService) {
    this.mapService.maps$
    .pipe(takeUntil(this.unSubscribe))
    .subscribe((maps) => {
      if (maps.viewer!) {
        this.map = maps.viewer;
      }
    });
  }
  
  ngOnInit(): void {
    this.zoomInInteraction =  new DragBox();
    this.zoomInInteraction.on('boxstart', this.onDragStart);
    this.zoomInInteraction.on('boxend', this.boxendListener);
    this.map.addInteraction(this.zoomInInteraction);
  }
  
  ngOnDestroy(): void {
    this.unSubscribe.next();
    this.unSubscribe.complete();
    this.zoomInInteraction.un('boxend', this.onDragStart);
    this.zoomInInteraction.un('boxend', this.boxendListener);
    this.map.removeInteraction(this.zoomInInteraction);
  }

  private onDragStart = (): void => {
    console.log('dragbox started');
    return;
    
  }

  private boxendListener = (): void => {
    const zoomInExtent = this.zoomInInteraction.getGeometry().getExtent();
    this.map.getView().fit(zoomInExtent);
  };
}
