import { IVisorTab} from '@core/interfaces/visor-tab.interfaz'

export const visorTabsConfig: IVisorTab[] = [
  {
    id: 'layers',
    title: 'Commutador de capes',
    openableSidebarNeeded: true,
    largeSidebarNeeded: false,
    icon: 'fg-layers-o fg-4x',
    iconStyle: 'font-size: 1.5rem; line-height: 1;'
  },
  {
    id: 'searchbycoord',
    title: 'Search by coordinates',
    widget: () => import('@features/visor/visor-sidebar/visor-search-by-coord/visor-search-by-coord.component').then(m => m.VisorSearchByCoordComponent),
    openableSidebarNeeded: true,
    largeSidebarNeeded: true,
    icon: 'fg-search-map fg-4x',
    iconStyle: 'font-size: 1.5rem; line-height: 1;'
  },
  {
    id: 'routes',
    title: 'Recursos',
    widget: () => import('@features/visor/visor-sidebar/visor-navigator/visor-navigator.component').then(m => m.VisorNavigatorComponent),
    openableSidebarNeeded: true,
    largeSidebarNeeded: false,
    icon: 'fg-car fg-4x',
    iconStyle: 'font-size: 1.5rem; line-height: 1;'
  },
  {
    id: 'routebyclicks',
    title: 'Navegació by clicks',
    openableSidebarNeeded: false,
    largeSidebarNeeded: false,
    icon: 'fg-route fg-4x',
    iconStyle: 'font-size: 1.5rem; line-height: 1;'
  },
  {
    id: 'info',
    title: 'Detalls del punt',
    widget: () => import('@features/visor/visor-sidebar/visor-info/visor-info.component').then(m => m.VisorInfoComponent),
    openableSidebarNeeded: true,
    largeSidebarNeeded: false,
    icon: 'pi pi-info-circle',
    iconStyle: 'font-size: 1.5rem'
  },
  {
    id: 'measurements',
    title: 'Mesuraments',
    widget: () => import('@features/visor/visor-sidebar/visor-measurement/visor-measurement.component').then(m => m.VisorMeasurementComponent),
    openableSidebarNeeded: true,
    largeSidebarNeeded: false,
    icon: 'fg-measure fg-4x',
    iconStyle: 'font-size: 1.5rem; line-height: 1;'
  },
];
