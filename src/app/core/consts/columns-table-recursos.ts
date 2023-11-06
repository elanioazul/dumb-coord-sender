export const RECURSOSCOLUMNS = [
  {
    field: 'resourceId',
    header: 'Id',
    type: 'numeric',
    dataType: 'numeric',
  },
  {
    field: 'coordx',
    header: 'Coordx',
    type: 'numeric',
    dataType: 'numeric',
  },
  {
    field: 'coordy',
    header: 'Coordy',
    type: 'numeric',
    dataType: 'numeric',
  },
  {
    field: 'distance',
    header: 'Distancia rectilínea',
    type: 'numeric',
    dataType: 'numeric',
  },
  {
    field: 'tiporecurso',
    header: 'Tipo de recurso',
    type: 'domain',
    dataType: 'text',
  },
  {
    field: 'actions',
    header: 'Accion',
    type: 'eye-icon',
    dataType: 'icon',
  },
];

export enum DOMAIN_TYPES  {
    "tiporecurso" = "tiporecurso"
}

export const TIPORECURSOCATEGORIAS = [
    {
      id: 1,
      name: "SAA",
      value: "SAA"
    },
    {
      id: 2,
      name: "SAM",
      value: "SAM"
    },
    {
      id: 3,
      name: "SVA",
      value: "SVA"
    },
    {
      id: 4,
      name: "SAS",
      value: "SAS"
    },
    {
      id: 5,
      name: "VIR",
      value: "VIR"
    },
    {
      id: 6,
      name: "MAU",
      value: "MAU"
    },
    {
      id: 7,
      name: "SAR",
      value: "SAR"
    },
    {
      id: 8,
      name: "SHL",
      value: "SHL"
    },
    {
      id: 9,
      name: "SME",
      value: "SME"
    },
    {
      id: 10,
      name: "SMU",
      value: "SMU"
    },
    {
      id: 11,
      name: "SPM",
      value: "SPM"
    },
    {
      id: 12,
      name: "SAO",
      value: "SAO"
    },
    {
      id: 13,
      name: "SEU",
      value: "SEU"
    },
    {
      id: 14,
      name: "SPI",
      value: "SPI"
    },
    {
      id: 15,
      name: "OUS",
      value: "OUS"
    },
    {
      id: 16,
      name: "SMD",
      value: "SMD"
    },
    {
      id: 17,
      name: "SIQ",
      value: "SIQ"
    },
    {
      id: 18,
      name: "ECO",
      value: "ECO"
    },
    {
      id: 19,
      name: "UIE",
      value: "UIE"
    },
    {
      id: 20,
      name: "SAQ",
      value: "SAQ"
    },
    {
      id: 21,
      name: "UIC",
      value: "UIC"
    },
    {
      id: 22,
      name: "SAT",
      value: "SAT"
    },
    {
      id: 23,
      name: "SCO",
      value: "SCO"
    },
    {
      id: 24,
      name: "ARU",
      value: "ARU"
    },
    {
      id: 25,
      name: "PRI",
      value: "PRI"
    },
    {
      id: 26,
      name: "AVO",
      value: "AVO"
    },
    {
      id: 27,
      name: "ECM",
      value: "ECM"
    },
    {
      id: 28,
      name: "SUS",
      value: "SUS"
    },
]

export const DOMAIN_FILTERS = {
    [DOMAIN_TYPES.tiporecurso]: TIPORECURSOCATEGORIAS
}

