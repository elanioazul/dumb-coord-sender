export const measurementTool = {
    id: 1,
    key: 'measurement',
    nombre: 'Mediciones',
    config: {
      modes: [
        {
          geometryType: 'LineString',
          icon: 'fg-measure fg-2x',
          type: 'distancia',
        },
        {
          geometryType: 'Polygon',
          icon: 'fg-measure-area-alt fg-2x',
          type: 'superficie',
        },
        {
          geometryType: 'Point',
          icon: 'fg-point fg-2x',
          type: 'coordenadas',
        },
      ],
      lengthUnits: [
        {
          code: 'km',
          label: 'Quilòmetres',
        },
      ],
      areaUnits: [
        {
          code: 'ha',
          label: 'Hectàrees',
        },
        {
          code: 'km2',
          label: 'Quilòmetres quadrats',
        },
        {
          code: 'm2',
          label: 'Metres quadrats',
        },
      ],
    },
  }