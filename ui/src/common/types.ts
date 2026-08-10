export interface Coordinate {
    longitude: number,
    latitude: number
}

export interface BoundingBox {
    topRight: Coordinate,
    bottomLeft: Coordinate
}