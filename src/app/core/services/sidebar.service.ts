import { Injectable, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private sidebarDiv = new Subject<ElementRef<HTMLDivElement> | undefined>();
  sidebarDiv$ = this.sidebarDiv.asObservable();

  private switchLayersDiv = new Subject<ElementRef<HTMLDivElement> | undefined>();
  switchLayersDiv$ = this.switchLayersDiv.asObservable();

  constructor() { }

  updateSidebarNode(template?: ElementRef<HTMLDivElement>) {
    this.sidebarDiv.next(template);
  }

  updateSwitchLayersNode(template?: ElementRef<HTMLDivElement>) {
    this.switchLayersDiv.next(template);
  }
}
