import {
  AfterViewInit,
  Component,
  ComponentRef,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { IVisorTab } from '@core/interfaces/visor-tab.interfaz';
import { SidebarService } from '@core/services/sidebar.service';

@Component({
  selector: 'app-visor-sidebar-tab',
  templateUrl: './visor-sidebar-tab.component.html',
  styleUrls: ['./visor-sidebar-tab.component.scss'],
  //encapsulation: ViewEncapsulation.None
})
export class VisorSidebarTabComponent implements OnInit, AfterViewInit {
  @ViewChild('widget') widgetDiv!: ElementRef<HTMLElement>;

  divSwitcher?: any;

  @ViewChild('container', {
    static: true,
    read: ViewContainerRef,
  })
  container!: ViewContainerRef;

  @Input() configOptions!: IVisorTab;

  @Output() messageEvent = new EventEmitter<string>();

  constructor(
    private sidebarService: SidebarService,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit(): void {
    this.checkIsSwitcherLayersTab();
  }

  ngOnInit() {
    this.loadWidget();
  }

  checkIsSwitcherLayersTab() {
    if (this.widgetDiv.nativeElement.getAttribute('id') === 'layers') {
      const elem = this.widgetDiv.nativeElement;
      this.renderer.addClass(
        elem,
        'layer-switcher'
      )
      this.divSwitcher = elem;
      this.sidebarService.updateSwitchLayersNode(this.divSwitcher);
    }
  }

  sendMessageToLoaderComp(tabName: string): void {
    this.messageEvent.emit(
      `mensaje por aqui al comp cargador desde componente ${tabName} dynamico`
    );
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
