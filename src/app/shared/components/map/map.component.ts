import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CursorStyleService } from '@core/services/cursor-style.service';
import { Feature, Map } from 'ol';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {

  @Input('map') map!: Map;

  @Output('onPointClicked') onPointClicked: EventEmitter<Feature> = new EventEmitter<Feature>();
  
  @ViewChild('map') mapRef!: ElementRef<HTMLElement>;

  constructor(private cursorStyleService: CursorStyleService) { }

  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    this.cursorStyleService.cursorStyle$.subscribe(cursorStyle => {
      this.mapRef.nativeElement.style.cursor = cursorStyle;
    });
    this.map.setTarget(this.mapRef.nativeElement);
    this.map.getViewport().addEventListener('click', this.onFeatureClicked.bind(this) );
  }

  ngOnDestroy(): void {
    this.map.getViewport().removeEventListener('click', this.onFeatureClicked);
  }

  private onFeatureClicked(e: UIEvent): void {
    e.preventDefault();
    const featuresCluster = this.map.forEachFeatureAtPixel(this.map.getEventPixel(e), function (feature, layer) { return feature; });
    const features = featuresCluster?.get('features');
    if(!features || features.length > 1) return;

    const singleFeature = features?.at(0);
    this.onPointClicked.emit(singleFeature);
  }

}
