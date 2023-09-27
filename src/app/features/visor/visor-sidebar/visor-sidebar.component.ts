import { Component, ViewChild, ElementRef, Output, Input, EventEmitter, AfterViewInit, Inject, InjectionToken, OnDestroy } from "@angular/core";
import { SidebarService } from "@core/services/sidebar.service";

@Component({
  selector: 'app-visor-sidebar',
  templateUrl: './visor-sidebar.component.html',
  styleUrls: ['./visor-sidebar.component.scss']
})
export class VisorSidebarComponent implements AfterViewInit {

  @ViewChild("sidebar") sidebarDiv!: ElementRef<HTMLElement>;
  @ViewChild("layers") switchLayersDiv!: ElementRef<HTMLElement>;

  divSidebar?: any;
  divSwitcher?: any;

  constructor(private sidebarService: SidebarService) {}

  ngAfterViewInit(): void {
    const element = this.sidebarDiv.nativeElement;
    this.divSidebar = element;
    this.sidebarService.sendTemplate(this.divSidebar);

    const element2 = this.switchLayersDiv.nativeElement;
    this.divSwitcher = element2;
    this.sidebarService.sendTemplate(this.divSwitcher);
  }

}
