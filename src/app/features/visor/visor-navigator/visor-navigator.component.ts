import { Component, OnInit } from '@angular/core';
import { recursos } from '@core/consts/recursos';
import { IRecurso } from '@core/interfaces/reecurso-interfaz';
import { OrsService } from '@core/services/ors.service';



@Component({
  selector: 'app-visor-navigator',
  templateUrl: './visor-navigator.component.html',
  styleUrls: ['./visor-navigator.component.scss']
})
export class VisorNavigatorComponent implements OnInit {

  recursos!: IRecurso[];

  selectedRecurso!: IRecurso;

  constructor(private orsService: OrsService) {}

  ngOnInit(): void {
    this.recursos = recursos;

    this.orsService.getLatestRuteDetails$.subscribe(([origin, destination]) => {
      if ((origin && destination) && origin != null && destination != null) {
        this.orsService.getOrsInfo(origin, destination).subscribe((res: any) => {
          this.orsService.setRuta(res.features[0].geometry);
        });
      }
    })
  }

  selectionChanged(option: any): void {
    const originFeature = this.orsService.getFeatureByType('origin');
    const routeFeature = this.orsService.getFeatureByType('route');
    const features = new Array(originFeature, routeFeature)
    if (originFeature) this.orsService.deleteFeatureFromLayer(features)
    this.orsService.setOrigin(option.value)
  }

}
