import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { SidebarService } from '@core/services/sidebar.service';
import { Map } from 'ol';
import { Subscription } from 'rxjs';
import { MapService } from 'src/app/core/services/map.service';
import Sidebar from '@core/js/ol5-sidebar.js';
import LayerSwitcher from 'ol-layerswitcher';
import { RenderOptions } from 'ol-layerswitcher';

@Component({
  selector: 'app-visor',
  templateUrl: './visor.component.html',
  styleUrls: ['./visor.component.scss'],
})
export class VisorComponent implements OnInit, AfterViewInit {
  subscriptions: Subscription[] = [];

  map!: Map;

  sidebarDiv?: ElementRef<HTMLElement>;
  sidebar: Sidebar | null = null;

  layerSwitcherDiv?: ElementRef<HTMLElement>;
  layerSwitcher: LayerSwitcher | null = null;
  optionsToRenderLayerSwitcher!: RenderOptions;

  domElement: any;

  constructor(
    private mapService: MapService,
    private sidebarService: SidebarService
  ) {
    this.subscriptions.push(
      this.sidebarService.sidebarDiv$.subscribe((domNode) => {
        if (domNode) {
          this.sidebarDiv = domNode;
          this.initMap();
          this.setSideBar();
        }
      })
    );
    this.subscriptions.push(
      this.sidebarService.switchLayersDiv$.subscribe((domNode) => {
        if (domNode) {
          this.layerSwitcherDiv = domNode;
          this.setSwitchLayers();
        }
      })
    );
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  initMap(): void {
    this.subscriptions.push(
      this.mapService.maps$.subscribe((maps) => {
        this.map = maps.viewer!;
      })
    );
  }

  refreshSidebar(): void {
    this.sidebar = new Sidebar({
      element: this.sidebarDiv,
    });
    this.sidebar.setMap(this.map);
    this.map.addControl(this.sidebar);
  }

  setSideBar(): void {
    this.refreshSidebar();
  }

  setSwitchLayers(): void {
    this.layerSwitcher = new LayerSwitcher({
      reverse: true,
      groupSelectStyle: 'none',
      activationMode: 'click',
      startActive: false,
      label: '',
      collapseTipLabel: 'Collapse legend',
    });
    this.domElement = this.layerSwitcherDiv;
    LayerSwitcher.renderPanel(this.map, this.domElement, { reverse: true });
  }
}
