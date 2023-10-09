import { Component, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { SidebarService } from "@core/services/sidebar.service";

@Component({
  selector: 'app-visor-sidebar',
  templateUrl: './visor-sidebar.component.html',
  styleUrls: ['./visor-sidebar.component.scss']
})
export class VisorSidebarComponent implements AfterViewInit {

  @ViewChild("sidebar") sidebarDiv!: ElementRef<HTMLElement>;
  @ViewChild("layers") switchLayersDiv!: ElementRef<HTMLElement>;
  @ViewChild("routes") routesDiv!: ElementRef<HTMLElement>;
  @ViewChild("info") infoDiv!: ElementRef<HTMLElement>;
  @ViewChild("measurements") measurementsDiv!: ElementRef<HTMLElement>;

  divSidebar?: any;
  divSwitcher?: any;

  constructor(private sidebarService: SidebarService) {}

  ngAfterViewInit(): void {
    const element = this.sidebarDiv.nativeElement;
    this.divSidebar = element;
    this.sidebarService.sendDiv(this.divSidebar);

    const element2 = this.switchLayersDiv.nativeElement;
    this.divSwitcher = element2;
    this.sidebarService.sendDiv(this.divSwitcher);
  }

  onSelectTab(tab: any): void {
    this.sidebarService.selectTab(tab);
  }
  
  onCloseTab(tab: any): void {
    this.sidebarService.closeTab(tab);
  }

}
