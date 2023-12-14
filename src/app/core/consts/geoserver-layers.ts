import { ILayerParams } from "@core/interfaces/layers-params-geoserver.interfaz"

export const adminlayersParams: ILayerParams[] = [
    {
        "LAYERS": "chronos-admin-division:NEIGHBOURHOOD_BCN_ETRS89",
        'FORMAT': 'image/png',
        'TILED': false
    },
    {
        "LAYERS": "chronos-admin-division:LOCALADMIN_CAT_ETRS89",
        'FORMAT': 'image/png',
        'TILED': false
    },
    {
        "LAYERS": "chronos-admin-division:LOCALADMIN_ESP_ETRS89",
        'FORMAT': 'image/png',
        'TILED': false   
    },
    {
        "LAYERS": "chronos-admin-division:LOCALADMIN_FRA_ETRS89",
        'FORMAT': 'image/png',
        'TILED': false   
    },
    {
        "LAYERS": "chronos-admin-division:LOCALADMIN_AND_ETRS89",
        'FORMAT': 'image/png',
        'TILED': false   
    },
    {
        "LAYERS": "chronos-admin-division:COUNTRY_ETRS89",
        'FORMAT': 'image/png',
        'TILED': false   
    }
]
export const sanitarialayersParams: ILayerParams[] = [
    {
        "LAYERS": "chronos-abs:ABS_2020_ETRS89",
        'FORMAT': 'image/png',
        'TILED': true
    }
]

export const construccionslayersParams: ILayerParams[] = [
    {
        "LAYERS": "SEM:_25_construccions_l",
        'FORMAT': 'image/png',
        'TILED': false
    },
    {
        "LAYERS": "SEM:_60_construccions_p",
        'FORMAT': 'image/png',
        'TILED': false
    },
    {
        "LAYERS": "SEM:Construccions",
        'FORMAT': 'image/png',
        'TILED': false
    }
]

export const ortoslayersParams: ILayerParams[] = [
    {
        "LAYERS": "SEM:OrtofotoTif",
        'FORMAT': 'image/jpeg',
        'TILED': false,
    },
]