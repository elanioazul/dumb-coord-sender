import { IVisorTab} from '@core/interfaces/visor-tab.interfaz'

export const visorTabsConfig: IVisorTab[] = [
  {
    id: 'layers',
    title: 'Commutador de capes',
    largeSidebarNeeded: false
  },
  {
    id: 'routes',
    title: 'Navegació',
    widget: () => import('@features/visor/visor-sidebar/visor-navigator/visor-navigator.component').then(m => m.VisorNavigatorComponent),
    largeSidebarNeeded: false
  },
  {
    id: 'info',
    title: 'Detalls del punt',
    widget: () => import('@features/visor/visor-sidebar/visor-info/visor-info.component').then(m => m.VisorInfoComponent),
    largeSidebarNeeded: false
  },
  {
    id: 'measurements',
    title: 'Mesuraments',
    widget: () => import('@features/visor/visor-sidebar/visor-measurement/visor-measurement.component').then(m => m.VisorMeasurementComponent),
    largeSidebarNeeded: false
  },
  {
    id: 'searchbycoord',
    title: 'Search by coordinates',
    widget: () => import('@features/visor/visor-sidebar/visor-search-by-coord/visor-search-by-coord.component').then(m => m.VisorSearchByCoordComponent),
    largeSidebarNeeded: true
  },
];
