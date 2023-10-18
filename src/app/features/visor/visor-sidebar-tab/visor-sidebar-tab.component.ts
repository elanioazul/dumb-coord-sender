import { AfterViewInit, Component, ComponentRef, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { IVisorTab } from '@core/interfaces/visor-tab.interfaz';
import { SidebarService } from '@core/services/sidebar.service';

@Component({
  selector: 'app-visor-sidebar-tab',
  templateUrl: './visor-sidebar-tab.component.html',
  styleUrls: ['./visor-sidebar-tab.component.scss'],
  //encapsulation: ViewEncapsulation.None
})
export class VisorSidebarTabComponent implements OnInit, AfterViewInit {
  @ViewChild("layers") switchLayersDiv!: ElementRef<HTMLElement>;
  @ViewChild("widget") widgetDiv!: ElementRef<HTMLElement>;

  divSwitcher?: any;

  @ViewChild('container', {
    static: true,
    read: ViewContainerRef
  }) container!: ViewContainerRef;
  
  @Input() configOptions!: IVisorTab;

  @Output() messageEvent = new EventEmitter<string>()

  constructor(private sidebarService: SidebarService){
    
    
  }
  ngAfterViewInit(): void {
    console.log(this.widgetDiv);
    if (this.widgetDiv.nativeElement.getAttribute('id') === 'layers') {
      const element2 = this.widgetDiv.nativeElement;
      this.divSwitcher = element2;
      this.sidebarService.sendTemplate(this.divSwitcher);
    }
  }

  ngOnInit() {
    this.loadWidget();
  }

  sendMessageToLoaderComp(): void {
    this.messageEvent.emit('mensaje por aqui al comp cargador desde comp dynamico')
  }

  private async loadWidget() {

    this.container.clear();

    if (this.configOptions.widget) {
      const componentInstance = await this.configOptions.widget();
      const componentRef: ComponentRef<any> = this.container.createComponent(componentInstance);
    }
  }

}
