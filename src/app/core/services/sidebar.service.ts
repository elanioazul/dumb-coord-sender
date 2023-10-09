import { Injectable, ElementRef } from '@angular/core';
import { BehaviorSubject, Subject, map, merge } from 'rxjs';
import { sideBarTab } from '@core/enums/sidebar-tabs.enum';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private sidebarDivs = new Subject<ElementRef<HTMLDivElement> | undefined>();
  sidebarDivs$ = this.sidebarDivs.asObservable();

  private sidebarTabSelected = new BehaviorSubject<[sideBarTab, ElementRef<HTMLDivElement>] | undefined>(undefined);
  sidebarTabSelected$ = this.sidebarTabSelected.pipe(
    map((tab) => ({tab, source: 'selection'}))
  );
  //sidebarTabSelected$ = this.sidebarTabSelected.asObservable();

  private sidebarTabClosed = new BehaviorSubject<[sideBarTab, ElementRef<HTMLDivElement>] | undefined>(undefined);
  sidebarTabClosed$ = this.sidebarTabClosed.pipe(
    map((tab) => ({tab, source: 'closure'}))
  );
  //sidebarTabClosed$ = this.sidebarTabClosed.asObservable();



  combined$ = merge(this.sidebarTabSelected$, this.sidebarTabClosed$).pipe(
    map((emission) => {
      return emission.tab ? emission : undefined
    })
  );

  constructor() { }

  sendDiv(template?: ElementRef<HTMLDivElement>) {
    this.sidebarDivs.next(template);
  }

  selectTab(templateDetails?: [sideBarTab, ElementRef<HTMLDivElement>]) {
    this.sidebarTabSelected.next(templateDetails);
  }
  
  closeTab(templateDetails: [sideBarTab, ElementRef<HTMLDivElement>]) {
    this.sidebarTabClosed.next(templateDetails);
  }
}
