import { Control } from 'ol/control.js';

export class MeasureWidget extends Control {
  constructor(opt_options?: any) {
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
}
