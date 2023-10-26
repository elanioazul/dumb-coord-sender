import { Component, ComponentRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { IVisorTab } from '@core/interfaces/visor-tab.interfaz';
@Component({
  selector: 'app-visor-sidebar-no-template-tab',
  templateUrl: './visor-sidebar-no-template-tab.component.html',
  //template: '',
  styleUrls: ['./visor-sidebar-no-template-tab.component.scss']
})
export class VisorSidebarNoTemplateTabComponent implements OnInit {
  @Input() configOptions!: IVisorTab;

  //@Output() messageEvent = new EventEmitter<string>();
  //subscriptions: Subscription[] = [];

  @ViewChild('container', {
    static: true,
    read: ViewContainerRef,
  })
  container!: ViewContainerRef;

  constructor() {}
  ngOnInit(): void {
    this.loadWidget();
    
  }

  private async loadWidget() {
    this.container.clear();

    if (this.configOptions.widget) {
      const componentInstance = await this.configOptions.widget();
      const componentRef: ComponentRef<any> =
        this.container.createComponent(componentInstance);
    }
  }

  
}
