interface Geometry {
  type: string;
  coordinates: number[];
}

//properties cuando salen desde bd oracle

// interface Properties {
//   ABSCISA_ED50_UTM31N: number;
//   ACTIVAR: number;
//   AYUDANTE: string;
//   BASE: number;
//   CODEMPRESA: number;
//   COORDX_ETRS89_UTM31N: number;
//   COORDY_ETRS89_UTM31N: number;
//   DATA_ALTA: string;
//   ESTADO: number;
//   FEC_CAMBIOTURNO: string;
//   GPS_START_BASE: number;
//   GW_NOTIFY_STATE: string;
//   HORARIO_FIN: string;
//   HORARIO_INI: string;
//   HORAS_DISPONIBLE: number;
//   ID_VEHICLE: string;
//   ISSI_MOBIL: number;
//   LAST_INI_FIN: string;
//   LAT_WGS84: number;
//   LNG_WGS84: number;
//   MATRICULA: string;
//   MNEMONIC_MOBIL: string;
//   ORDEN: number;
//   ORDENADA_ED50_UTM31N: number;
//   RECURSO: string;
//   RECURS_EMBARCAT: number;
//   TELEFONO: number;
//   TIME_LASTCOORD: string;
//   TIPORECURSO: string;
//   ZONA_COBERTURA: number;
// }

//properties cuando salen desde shp

interface Properties {
  ABSCISA_ED: number;
  ACTIVAR: number;
  AYUDANTE: string;
  BASE: number;
  BASTIDOR: string;
  CINCIDENTE: number;
  CODEMPRESA: number;
  CODEXTERN: number;
  CONDUCTOR: string;
  CONTADOR: number;
  COORDINACI: string;
  COORDX_ETR: number;
  COORDY_ETR: number;
  COORD_GOOD: string;
  CT_COM_BAS: string;
  CT_COM_ESP: string;
  CT_MUN_BAS: string;
  CT_MUN_ESP: string;
  CT_PCI_BAS: string;
  CT_PCI_ESP: string;
  CT_SM1_BAS: string;
  CT_SM1_ESP: string;
  CT_SM2_BAS: string;
  CT_SM2_ESP: string;
  DATA_ALTA: string;
  DATA_BAIXA: string;
  ENFERMERO: string;
  ESTADO: number;
  EXT_ORGANI: string;
  FEC_CAMBIO: string;
  GPS_START_: number;
  GW_NOTIFY_: string;
  HAS_AL20: number;
  HORAFINAL: string;
  HORAINICIO: string;
  HORARIO_FI: string;
  HORARIO_IN: string;
  HORAS_DISP: number;
  ID_VEHICLE: string;
  ISSI_MOBIL: number;
  IS_EXTERNA: string;
  LAST_INI_F: string;
  LAT_WGS84: number;
  LNG_WGS84: number;
  MATRICULA: string;
  MEDICO: string;
  MNEMONIC_M: string;
  ORDEN: number;
  ORDENADA_E: number;
  ORIGEN: string;
  ORIGENPG: string;
  PLAZAS: number;
  RADIO: string;
  RECURSO: string;
  RECURS_EMB: number;
  SE_DEVICE_: string;
  TABLET_PC: string;
  TELEFONO: number;
  TIME_LASTC: string;
  TIPOPROVEE: string;
  TIPORECURS: string;
  ZONA_COBER: number;
}

interface Feature {
  type: string;
  id: string;
  geometry: Geometry;
  geometry_name: string;
  properties: Properties;
}

export interface FeatureCollection {
  type: string;
  totalFeatures: string | number;
  features: Feature[];
}
