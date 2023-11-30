interface Geometry {
  type: string;
  coordinates: number[];
}

interface Properties {
  ABSCISA_ED50_UTM31N: number;
  ACTIVAR: number;
  AYUDANTE: string;
  BASE: number;
  CODEMPRESA: number;
  COORDX_ETRS89_UTM31N: number;
  COORDY_ETRS89_UTM31N: number;
  DATA_ALTA: string;
  ESTADO: number;
  FEC_CAMBIOTURNO: string;
  GPS_START_BASE: number;
  GW_NOTIFY_STATE: string;
  HORARIO_FIN: string;
  HORARIO_INI: string;
  HORAS_DISPONIBLE: number;
  ID_VEHICLE: string;
  ISSI_MOBIL: number;
  LAST_INI_FIN: string;
  LAT_WGS84: number;
  LNG_WGS84: number;
  MATRICULA: string;
  MNEMONIC_MOBIL: string;
  ORDEN: number;
  ORDENADA_ED50_UTM31N: number;
  RECURSO: string;
  RECURS_EMBARCAT: number;
  TELEFONO: number;
  TIME_LASTCOORD: string;
  TIPORECURSO: string;
  ZONA_COBERTURA: number;
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
