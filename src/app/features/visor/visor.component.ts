import { Component, OnInit } from '@angular/core';
import { Map } from 'ol';
import { Subscription } from 'rxjs';
import { MapService } from 'src/app/core/services/map.service';

@Component({
  selector: 'app-visor',
  templateUrl: './visor.component.html',
  styleUrls: ['./visor.component.scss']
})
export class VisorComponent implements OnInit {
  subscriptions: Subscription[] = [];

  map!: Map;

  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    this.initMap();
  }

  initMap(): void {
    this.subscriptions.push(
      this.mapService.maps$.subscribe((maps) => {
        this.map = maps.viewer!;
        //this.mapService.addFeature('vectorOverview', feature);
      })
    );
  }
}
