import { IVisorTab} from '@core/interfaces/visor-tab.interfaz'
// import { VisorNavigatorComponent } from '@features/visor/visor-sidebar/visor-navigator/visor-navigator.component';
// import { VisorInfoComponent } from '@features/visor/visor-sidebar/visor-info/visor-info.component';
// import { VisorMeasurementComponent } from '@features/visor/visor-sidebar/visor-measurement/visor-measurement.component';
// export const visorTabsConfig: {
//   [key: string]: string;
// }[] = [
//   {
//     id: 'layers',
//     title: 'Commutador de capes',
//   },
//   {
//     id: 'routes',
//     title: 'Navegació',
//   },
//   {
//     id: 'info',
//     title: 'Detalls del punt',
//   },
//   {
//     id: 'measurements',
//     title: 'Twitter',
//   },
// ];

export const visorTabsConfig: IVisorTab[] = [
  {
    id: 'layers',
    title: 'Commutador de capes'
  },
  {
    id: 'routes',
    title: 'Navegació',
    widget: () => import('@features/visor/visor-sidebar/visor-navigator/visor-navigator.component').then(m => m.VisorNavigatorComponent),
  },
  {
    id: 'info',
    title: 'Detalls del punt',
    widget: () => import('@features/visor/visor-sidebar/visor-info/visor-info.component').then(m => m.VisorInfoComponent),
  },
  {
    id: 'measurements',
    title: 'Mesuraments',
    widget: () => import('@features/visor/visor-sidebar/visor-measurement/visor-measurement.component').then(m => m.VisorMeasurementComponent),
  },
];
