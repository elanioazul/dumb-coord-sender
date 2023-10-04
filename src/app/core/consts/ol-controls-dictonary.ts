import { IChronosOlControl } from '@core/interfaces/ol-control-options.interfaz';

export const chronosOlCustomControls: IChronosOlControl[] = [
  {
    id: 1,
    name: 'measure',
    desc: 'permite la medición de distancias y areas',
    config: {
      icon: '',
      type: 'simpleWidget',
      state: true
    }
  }
]