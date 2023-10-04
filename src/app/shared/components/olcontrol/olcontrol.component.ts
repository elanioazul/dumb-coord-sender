import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Control } from 'ol/control.js';
import { DropdownModule } from 'primeng/dropdown';
import  {IChronosOlControl } from '@core/interfaces/ol-control-options.interfaz'
@Component({
  selector: 'app-olcontrol',
  standalone: true,
  imports: [CommonModule, DropdownModule],
  templateUrl: './olcontrol.component.html',
  styleUrls: ['./olcontrol.component.scss'],
})
export class OlcontrolComponent extends Control {
  @Output() messageEvent = new EventEmitter<string>()

  constructor(@Inject(Object) opt_options?: IChronosOlControl) {
    const options = opt_options || {};
    const button = document.createElement('button');
    button.innerHTML = 'N';

    const element = document.createElement('div');
    element.className = 'ol-measure ol-unselectable ol-control';
    element.appendChild(button);
    super({
        element: element,
        target: options.target,
      });
    button.addEventListener('click', this.sayHelloFromInsideControl.bind(this), false);
  }
  sayHelloFromInsideControl() {
    console.log('hello from the inside control');
    ;
  }

  ngOnInit() {
  }

  sendMessageToLoaderComp(): void {
    this.messageEvent.emit('mensaje por aqui al comp cargador de mi')
  }
}
