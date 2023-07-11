import { Component, OnInit } from '@angular/core';
import { Feature, Map } from 'ol';
import { Subscription } from 'rxjs';
import { MapService } from 'src/app/services/map.service';
@Component({
  selector: 'app-mapviewer',
  templateUrl: './mapviewer.component.html',
  styleUrls: ['./mapviewer.component.scss']
})
export class MapviewerComponent implements OnInit {

  subscriptions: Subscription[] = [];

  map!: Map;

  constructor(private mapService: MapService){}

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
