import { Geodesic } from 'geographiclib-geodesic';
import type {Coordinate} from "./types.ts";

export const debounce = (timeout: number, func: () => void) => {
    let timeoutId = setTimeout(func, timeout);

    return () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(func, timeout);
    }
}

export const calcLongLatDistance = (coord1: Coordinate, coord2: Coordinate) => {
    return Geodesic.WGS84.Inverse(
        coord1.latitude,
        coord1.longitude,
        coord2.latitude,
        coord2.longitude
    ).s12;
}