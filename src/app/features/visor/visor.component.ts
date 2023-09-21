import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { SidebarService } from '@core/services/sidebar.service';
import { Map } from 'ol';
import { Subscription } from 'rxjs';
import { MapService } from 'src/app/core/services/map.service';
import Sidebar from "@core/js/ol5-sidebar.js";

@Component({
  selector: 'app-visor',
  templateUrl: './visor.component.html',
  styleUrls: ['./visor.component.scss']
})
export class VisorComponent implements OnInit, AfterViewInit {
  subscriptions: Subscription[] = [];

  map!: Map;

  templateSubscription!: Subscription;
  templateArray: ElementRef<HTMLElement>[] = [];

  sidebarDiv?: ElementRef<HTMLElement>;
  layerSwitcherDiv?: ElementRef<HTMLElement>;

  sidebar: Sidebar | null = null;

  constructor(private mapService: MapService, private sidebarService: SidebarService) {
    this.templateSubscription = this.sidebarService.template$.subscribe( domNode => {
      if (domNode) {
        this.templateArray.push(domNode)
      } else {
        this.templateArray = []
      }
    })
  }
  
  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initMap();
    this.setDivs();
    this.setSideBar();
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
      if (element['className'] === 'sidebar collapsed') {
        this.sidebarDiv = element;
      } else if (element['className'] === 'layer-switcher') {
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

}
