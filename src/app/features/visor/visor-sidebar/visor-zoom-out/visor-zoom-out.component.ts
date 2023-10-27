import { Component, OnDestroy, OnInit } from '@angular/core';
import { MapService } from '@core/services/map.service';
import DragBox from 'ol/interaction/DragBox';
import { Subject, takeUntil } from 'rxjs';
import { Map } from 'ol';
import { CursorStyleService } from '@core/services/cursor-style.service';
@Component({
  selector: 'app-visor-zoom-out',
  templateUrl: './visor-zoom-out.component.html',
  styleUrls: ['./visor-zoom-out.component.scss']
})
export class VisorZoomOutComponent implements OnInit, OnDestroy {
  private unSubscribe = new Subject<void>();

  map!: Map;

  zoomOutInteraction!: DragBox;

  constructor(private mapService: MapService, private cursorStyleService: CursorStyleService) {
    this.mapService.maps$
    .pipe(takeUntil(this.unSubscribe))
    .subscribe((maps) => {
      if (maps.viewer!) {
        this.map = maps.viewer;
      }
    });
    this.cursorStyleService.setCursorStyle('zoom-out');
  }

  
  ngOnInit(): void {
    this.zoomOutInteraction = new DragBox();
    this.zoomOutInteraction.on('boxstart', this.onDragStart);
    this.zoomOutInteraction.on('boxend', this.boxendListener);
    this.map.addInteraction(this.zoomOutInteraction);
  }
  
  ngOnDestroy(): void {
    this.unSubscribe.next();
    this.unSubscribe.complete();
    this.zoomOutInteraction.un('boxstart', this.onDragStart);
    this.zoomOutInteraction.un('boxend', this.boxendListener);
    this.map.removeInteraction(this.zoomOutInteraction);
    this.cursorStyleService.setCursorStyle('default');
  }

  private onDragStart = (): void => {
    console.log('dragbox started');
    return;
    
  }

  private boxendListener = (): void => {
    const zoomOutExtent = this.zoomOutInteraction.getGeometry().getExtent();
    this.map.getView().fit(zoomOutExtent)
    const currentZoom = this.map.getView().getZoom();
    if (currentZoom)
    this.map.getView().setZoom(currentZoom - 2);
  }
}
