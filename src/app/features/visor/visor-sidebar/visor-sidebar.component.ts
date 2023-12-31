import { Component, ViewChild, ElementRef, Output, Input, EventEmitter, AfterViewInit, Inject, InjectionToken, OnDestroy, ViewContainerRef, ComponentRef } from "@angular/core";
import { visorTabsConfig } from "@core/consts/visor-tab-config";
import { IVisorTab } from "@core/interfaces/visor-tab.interfaz";
import { SidebarService } from "@core/services/sidebar.service";
import { VisorSidebarTabComponent } from '@features/visor/visor-sidebar-tab/visor-sidebar-tab.component';
import { VisorSidebarNoTemplateTabComponent }  from '@features/visor/visor-sidebar-no-template-tab/visor-sidebar-no-template-tab.component';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-visor-sidebar',
  templateUrl: './visor-sidebar.component.html',
  styleUrls: ['./visor-sidebar.component.scss']
})
export class VisorSidebarComponent implements AfterViewInit {

  visorTabsConfig = visorTabsConfig;

  @ViewChild('container', {
    static: true,
    read: ViewContainerRef
  }) container!: ViewContainerRef;

  @ViewChild("sidebar") sidebarDiv!: ElementRef<HTMLElement>;

  divSidebar?: any;

  constructor(private sidebarService: SidebarService, private messageService: MessageService) {}

  emptyTemplateTabsOptionsByType = (type: string) => {
    switch (type) {
      case 'routebyclicks':
        return {
          component: () => import('@features/visor/visor-sidebar-no-template-tab/visor-sidebar-no-template-tab.component').then(m => m.VisorSidebarNoTemplateTabComponent),
          inputs: visorTabsConfig.find(item => item['id'] === type)!
        }
      case 'zoomin':
        return {
          component: () => import('@features/visor/visor-sidebar-no-template-tab/visor-sidebar-no-template-tab.component').then(m => m.VisorSidebarNoTemplateTabComponent),
          inputs: visorTabsConfig.find(item => item['id'] === type)!
        }
      case 'zoomout':
        return {
          component: () => import('@features/visor/visor-sidebar-no-template-tab/visor-sidebar-no-template-tab.component').then(m => m.VisorSidebarNoTemplateTabComponent),
          inputs: visorTabsConfig.find(item => item['id'] === type)!
        }
      default:
        return {
          component: () => import('@features/visor/visor-sidebar-no-template-tab/visor-sidebar-no-template-tab.component').then(m => m.VisorSidebarNoTemplateTabComponent),
          inputs: visorTabsConfig.find(item => item['id'] === type)!
        }

    }
  }

  templateTabsOptionsByType = (type: string) => {
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
      case 'searchbycoord':
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
    const tabConfig = this.visorTabsConfig.find((config: IVisorTab) => config.id === tab);
    if (!tabConfig?.openableSidebarNeeded) {
      this.container.clear();
      this.createDynamicNoTemplateTab(tab);
    } else {
      this.createDynamicSidebarTab(tab)
      
    }
  }

  private async createDynamicSidebarTab(type: string) {

    this.clearToasts();

    this.container.clear();
    const {component, inputs} = this.templateTabsOptionsByType(type);

    const componentInstance = await component();
    const componentRef: ComponentRef<VisorSidebarTabComponent> = this.container.createComponent(componentInstance);
    this.updateSidebar();
    componentRef.instance.configOptions = inputs;
    componentRef.instance.messageEvent.subscribe((data:any)=>{
      console.log(data);
    })
  }

  private async createDynamicNoTemplateTab(type: string) {

    this.clearToasts();
    
    this.container.clear();
    const {component, inputs} = this.emptyTemplateTabsOptionsByType(type);
    
    this.showToastMessage(inputs.toasterMessage);

    const componentInstance = await component();
    const componentRef: ComponentRef<VisorSidebarNoTemplateTabComponent> = this.container.createComponent(componentInstance);
    this.updateSidebar();
    componentRef.instance.configOptions = inputs;
    // componentRef.instance.messageEvent.subscribe((data:any)=>{
    //   console.log(data);
    // })
  }

  private showToastMessage(message?: string): void {
    this.messageService.add({ severity: 'info', summary: 'Info', detail: message });
  }

  private clearToasts() {
    this.messageService.clear();
  }

}
