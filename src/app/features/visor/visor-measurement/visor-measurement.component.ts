import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';

import { measurementTool } from '@core/consts/config-measurement-tool';
import { MapService } from '@core/services/map.service';
import { Geometry, Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from 'ol/style';
import { Subject, takeUntil } from 'rxjs';
import Tooltip from 'ol-ext/overlay/Tooltip';
import Popup from 'ol-ext/overlay/Popup';
import Draw from 'ol/interaction/Draw';
import { Map } from 'ol';
import { SidebarService } from '@core/services/sidebar.service';
import { sideBarTabNames, sideBarTab } from '@core/enums/sidebar-tabs.enum';

@Component({
  selector: 'app-visor-measurement',
  templateUrl: './visor-measurement.component.html',
  styleUrls: ['./visor-measurement.component.scss'],
})
export class VisorMeasurementComponent implements OnInit, OnDestroy {
  private unSubscribe = new Subject<void>();

  map!: Map;

  public measurementTool = measurementTool;
  public selectedMode = measurementTool.config.modes[0];
  public selectedLengthUnit;
  public selectedAreaUnit;

  private measuringLayer!: VectorLayer<VectorSource<Geometry>>;
  private tooltip: Tooltip;
  private coordsPopup: Popup;
  drawLine: any;
  drawPoly: any;
  drawPoint: any;

  popupMarkerStyle = new Style({
    image: new Icon({
      anchorOrigin: 'top-left',
      anchorXUnits: 'pixels',
      anchorYUnits: 'pixels',
      anchor: [40, 80],
      height: 30,
      opacity: 0.8,
      color: 'red',
      src: '../../../assets/icons/uEA35-pin-earth.svg',
    }),
  });

  constructor(
    private mapService: MapService,
    private sidebarService: SidebarService
  ) {
    this.sidebarService.combined$.subscribe((data: any) => {
      this.determinehook(data)
    });
  }

  ngOnDestroy(): void {
    this.unSubscribe.next();
    this.unSubscribe.complete();
    this.map?.removeOverlay(this.tooltip);
    this.map?.removeOverlay(this.coordsPopup);
    this.map?.removeInteraction(this.drawLine);
    this.map?.removeInteraction(this.drawPoly);
    this.map?.removeInteraction(this.drawPoint);
    this.measuringLayer.setMap(null);
  }

  ngOnInit(): void {
    this.commonInitialization();
  }

  private determinehook(data: any): void {
    if (data == undefined) {
      return;
    }
    if ((data.source === 'closure' && data.tab[0] === sideBarTabNames.measurements) || (data.source === 'selection' && data.tab[0] !== sideBarTabNames.measurements)) {
      this.ngOnDestroy()
    }
    if (data.source === 'selection' && data.tab[0] === sideBarTabNames.measurements) {
      this.commonInitialization()
    }
  }

  private commonInitialization(): void {
    //this.selectedAreaUnit = measurementTool.config.areaUnits[0];
    //this.selectedLengthUnit = measurementTool.config.lengthUnits[0];
    this.measuringLayer = new VectorLayer({
      source: new VectorSource(),
      style: this.popupMarkerStyle,
    });
    this.mapService.maps$
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((maps) => {
        if (maps.viewer!) {
          this.map = maps.viewer;
          this.addInteractions();
          this.tooltip = new Tooltip({
            formatArea: this.formatArea,
            formatLength: this.formatLength,
          });
          this.map.addOverlay(this.tooltip);
          this.createCoordsPopup();
          this.setEvents();
          this.measuringLayer.setMap(this.map);
        }
      });
  }

  private setEvents(): void {
    this.setDrawLineEvents();
    this.setDrawPolygonEvents();
    this.setDrawPointEvents();
  }

  private setDrawPointEvents() {
    this.drawPoint.on('drawend', this.showCoordsPopup);
  }

  private setDrawPolygonEvents() {
    this.drawPoly.on('drawstart', this.tooltip.setFeature.bind(this.tooltip));
    this.drawPoly.on(
      ['change:active', 'drawend'],
      this.tooltip.removeFeature.bind(this.tooltip)
    );
  }

  private setDrawLineEvents() {
    this.drawLine.on('drawstart', this.tooltip.setFeature.bind(this.tooltip));
    this.drawLine.on(
      ['change:active', 'drawend'],
      this.tooltip.removeFeature.bind(this.tooltip)
    );
  }

  private showCoordsPopup = (ev) => {
    this.measuringLayer.getSource()?.clear();
    this.coordsPopup.show(
      ev.feature.getGeometry().getCoordinates(),
      this.formatCoords(ev.feature.getGeometry())
    );
    this.measuringLayer.getSource()?.addFeature(ev.feature);
  };

  private formatCoords(point: Point): string {
    const coords = point.getCoordinates();
    const x = coords[0].toLocaleString('es-es', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    });
    const y = coords[1].toLocaleString('es-es', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    });
    return `x: ${x} | y: ${y}`;
  }

  private createCoordsPopup(): void {
    this.coordsPopup = new Popup({
      id: 'coordsPopup',
      popupClass: 'tooltips marginTooltip',
      closeBox: false,
      positioning: 'bottom-auto',
      autoPan: true,
      autoPanAnimation: { duration: 250 },
    });
    this.map.addOverlay(this.coordsPopup);
  }

  private addInteractions(): void {
    this.drawLine = new Draw({ type: 'LineString' });
    this.drawPoly = new Draw({ type: 'Polygon' });
    this.drawPoint = new Draw({ type: 'Point' });
    this.map.addInteraction(this.drawLine);
    this.map.addInteraction(this.drawPoly);
    this.map.addInteraction(this.drawPoint);
    this.drawLine.setActive(false);
    this.drawPoly.setActive(false);
    this.drawPoint.setActive(false);
  }

  // Llega el área en m2 por ser mercator la proj del mapa
  private formatArea = (area: number) => {
    let output;
    switch (this.selectedAreaUnit.code) {
      case 'ha':
        output = (area / 10000).toLocaleString('es-es', {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        });
        break;
      case 'km2':
        output = (area / 1000000).toLocaleString('es-es', {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        });
        break;
      // Default en m2
      default:
        output = area.toLocaleString('es-es', {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        });
        break;
    }
    output += ` ${this.selectedAreaUnit.code}`;
    return output;
  };

  // Llega la distancia en m por ser mercator la proj del mapa
  private formatLength = (length: number) => {
    let output;
    if (this.selectedLengthUnit.code === 'km') {
      output = (length / 1000).toLocaleString('es-es', {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      });
    } else {
      output = length.toLocaleString('es-es', {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      });
    }
    output += ` ${this.selectedLengthUnit.code}`;
    return output;
  };

  public onModeChanged(type: string, isInitial = false): void {
    this.tooltip.hide();
    switch (type) {
      case 'distancia':
        this.measuringLayer.getSource()?.clear();
        this.coordsPopup.hide();
        this.drawLine.setActive(true);
        this.drawPoly.setActive(false);
        this.drawPoint.setActive(false);
        break;
      case 'superficie':
        this.measuringLayer.getSource()?.clear();
        this.coordsPopup.hide();
        this.drawLine.setActive(false);
        this.drawPoly.setActive(true);
        this.drawPoint.setActive(false);
        break;
      case 'coordenadas':
        this.drawLine.setActive(false);
        this.drawPoly.setActive(false);
        this.drawPoint.setActive(true);
        break;
    }
  }
}
