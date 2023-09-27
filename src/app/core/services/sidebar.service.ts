import { Injectable, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private templateSource = new Subject<ElementRef<HTMLDivElement> | undefined>();

  template$ = this.templateSource.asObservable();

  constructor() { }

  sendTemplate(template?: ElementRef<HTMLDivElement>) {
    this.templateSource.next(template);
  }
}
