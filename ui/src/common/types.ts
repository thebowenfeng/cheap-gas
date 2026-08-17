export interface Coordinate {
    longitude: number,
    latitude: number
}

export interface BoundingBox {
    topRight: Coordinate,
    bottomLeft: Coordinate
}

export type FuelType =
    | 'E10'
    | 'U91'
    | 'DIESEL'
    | 'PremDSL'
    | 'U95'
    | 'U98'
    | 'LPG'
    | 'TruckDSL'
    | 'E85'
    | 'BIODIESEL'
    | 'AdBlue';
