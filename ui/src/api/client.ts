import type {BoundingBox} from "../common/types.ts";
import type {GasStation} from "./types.ts";

let cache: GasStation[] = [];

export const searchGasStations = async (currentBox: BoundingBox) => {
    const response = await fetch("http://localhost:8080/search/stations", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentBox)
    });
    if (!response.ok) {
        return cache;
    }
    const result = await response.json() as GasStation[];
    cache = result;
    return result;
}