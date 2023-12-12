import { ILayerParams } from "@core/interfaces/layers-params-geoserver.interfaz"

export const adminlayersParams: ILayerParams[] = [
    {
        "ORIGIN": 'local',
        "ORIGIN_URL": "http://localhost:8080/geoserver/ows?",
        "LAYERS": "chronos-admin-division:NEIGHBOURHOOD_BCN_ETRS89",
        'FORMAT': 'image/png',
        'TILED': false
    },
    {
        "ORIGIN": 'local',
        "ORIGIN_URL": "http://localhost:8080/geoserver/ows?",
        "LAYERS": "chronos-admin-division:LOCALADMIN_CAT_ETRS89",
        'FORMAT': 'image/png',
        'TILED': false
    },
    {
        "ORIGIN": 'local',
        "ORIGIN_URL": "http://localhost:8080/geoserver/ows?",
        "LAYERS": "chronos-admin-division:LOCALADMIN_ESP_ETRS89",
        'FORMAT': 'image/png',
        'TILED': false   
    },
    {
        "ORIGIN": 'local',
        "ORIGIN_URL": "http://localhost:8080/geoserver/ows?",
        "LAYERS": "chronos-admin-division:LOCALADMIN_FRA_ETRS89",
        'FORMAT': 'image/png',
        'TILED': false   
    },
    {
        "ORIGIN": 'local',
        "ORIGIN_URL": "http://localhost:8080/geoserver/ows?",
        "LAYERS": "chronos-admin-division:LOCALADMIN_AND_ETRS89",
        'FORMAT': 'image/png',
        'TILED': false   
    },
    {
        "ORIGIN": 'local',
        "ORIGIN_URL": "http://localhost:8080/geoserver/ows?",
        "LAYERS": "chronos-admin-division:COUNTRY_ETRS89",
        'FORMAT': 'image/png',
        'TILED': false   
    }
]
export const sanitarialayersParams: ILayerParams[] = [
    {
        "ORIGIN": 'local',
        "ORIGIN_URL": "http://localhost:8080/geoserver/ows?",
        "LAYERS": "chronos-abs:ABS_2020_ETRS89",
        'FORMAT': 'image/png',
        'TILED': true
    }
]

export const construccionslayersParams: ILayerParams[] = [
    {
        "ORIGIN": 'laboratory',
        "ORIGIN_URL": "http://10.225.20.55:9090/SEM/wms?",
        "LAYERS": "SEM:_25_construccions_l",
        'FORMAT': 'image/png',
        'TILED': false
    },
    {
        "ORIGIN": 'laboratory',
        "ORIGIN_URL": "http://10.225.20.55:9090/SEM/wms?",
        "LAYERS": "SEM:_60_construccions_p",
        'FORMAT': 'image/png',
        'TILED': false
    }
]