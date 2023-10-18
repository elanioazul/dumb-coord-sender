import { Component, ViewChild, ElementRef, Output, Input, EventEmitter, AfterViewInit, Inject, InjectionToken, OnDestroy, ViewContainerRef, ComponentRef } from "@angular/core";
import { visorTabsConfig } from "@core/consts/visor-tab-config";
import { SidebarService } from "@core/services/sidebar.service";
import { VisorSidebarTabComponent } from '@features/visor/visor-sidebar-tab/visor-sidebar-tab.component';

@Component({
  selector: 'app-visor-sidebar',
  templateUrl: './visor-sidebar.component.html',
  styleUrls: ['./visor-sidebar.component.scss']
})
export class VisorSidebarComponent implements AfterViewInit {

  @ViewChild('container', {
    static: true,
    read: ViewContainerRef
  }) container!: ViewContainerRef;

  @ViewChild("sidebar") sidebarDiv!: ElementRef<HTMLElement>;

  divSidebar?: any;

  constructor(private sidebarService: SidebarService) {}

  optionsByType = (type: string) => {
    switch (type) {
      case 'layers':
        return {
          component: () => import('@features/visor/visor-sidebar-tab/visor-sidebar-tab.component').then(m => m.VisorSidebarTabComponent),
          inputs: visorTabsConfig.find(item => item['id'] === type)!
        }
      case 'routes':
        return {
          component: () => import('@features/visor/visor-sidebar-tab/visor-sidebar-tab.component').then(m => m.VisorSidebarTabComponent),
          inputs: visorTabsConfig.find(item => item['id'] === type)!
        }
      case 'info':
        return {
          component: () => import('@features/visor/visor-sidebar-tab/visor-sidebar-tab.component').then(m => m.VisorSidebarTabComponent),
          inputs: visorTabsConfig.find(item => item['id'] === type)!
        }
      case 'measurements':
        return {
          component: () => import('@features/visor/visor-sidebar-tab/visor-sidebar-tab.component').then(m => m.VisorSidebarTabComponent),
          inputs: visorTabsConfig.find(item => item['id'] === type)!
        }
      default:
        return {
          component: () => import('@features/visor/visor-sidebar-tab/visor-sidebar-tab.component').then(m => m.VisorSidebarTabComponent),
          inputs: visorTabsConfig.find(item => item['id'] === type)!
        }
    }
  }

  updateSidebar(): void {
    const element = this.sidebarDiv.nativeElement;
    this.divSidebar = element;
    this.sidebarService.updateSidebarNode(this.divSidebar);
  }

  ngAfterViewInit(): void {
    this.updateSidebar();
  }

  onSelectTab(tab: any): void {
    this.createDynamicSidebarTab(tab)
  }

  private async createDynamicSidebarTab(type: string) {

    this.container.clear();
    const {component, inputs} = this.optionsByType(type);

    const componentInstance = await component();
    const componentRef: ComponentRef<VisorSidebarTabComponent> = this.container.createComponent(componentInstance);
    this.updateSidebar();
    componentRef.instance.configOptions = inputs;
    componentRef.instance.messageEvent.subscribe((data:any)=>{
      console.log(data);
    })
  }

}
