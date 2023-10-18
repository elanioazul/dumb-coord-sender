import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { SidebarService } from '@core/services/sidebar.service';
import { Map } from 'ol';
import { Subscription } from 'rxjs';
import { MapService } from 'src/app/core/services/map.service';
import Sidebar from "@core/js/ol5-sidebar.js";
import LayerSwitcher from 'ol-layerswitcher';
import {
  RenderOptions,
 } from 'ol-layerswitcher';

@Component({
  selector: 'app-visor',
  templateUrl: './visor.component.html',
  styleUrls: ['./visor.component.scss']
})
export class VisorComponent implements OnInit, AfterViewInit {
  subscriptions: Subscription[] = [];

  map!: Map;

  //templateSubscription!: Subscription;
  templateArray: ElementRef<HTMLElement>[] = [];

  sidebarDiv?: ElementRef<HTMLElement>;
  sidebar: Sidebar | null = null;

  layerSwitcherDiv?: ElementRef<HTMLElement>;
  layerSwitcher: LayerSwitcher | null = null;
  optionsToRenderLayerSwitcher!: RenderOptions;

  domElement: any;

  constructor(private mapService: MapService, private sidebarService: SidebarService) {
    this.subscriptions.push(this.sidebarService.template$.subscribe( domNode => {
      if (domNode) {
        this.templateArray.push(domNode)
        this.setDivs();
      } else {
        this.templateArray = []
      }
    })
    )
  }
  
  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initMap();
    //this.setDivs();
    this.setSideBar();
    this.setSwitchLayers();
  }

  initMap(): void {
    this.subscriptions.push(
      this.mapService.maps$.subscribe((maps) => {
        this.map = maps.viewer!;
        //this.mapService.addFeature('vectorOverview', feature);
      })
    );
  }

  setDivs() {
    this.templateArray.forEach(element => {
      if (element['id'] === 'sidebar') {
        this.sidebarDiv = element;
      } else if (element['id'] === 'layers') {
        this.layerSwitcherDiv = element
      }
    })
  }

  setSideBar(): void {
    this.sidebar = new Sidebar({
      element: this.sidebarDiv
    });
    this.sidebar.setMap(this.map);
    this.map.addControl(this.sidebar);
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
    LayerSwitcher.renderPanel(this.map, this.domElement, { reverse: true})
  }

}
