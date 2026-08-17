import type {Coordinate, FuelType} from "../common/types.ts";

interface TradingHour {
    startMinute: number,
    endMinute: number
}

interface Price {
    type: FuelType,
    updated: number,
    amount: number
}

export interface GasStation {
    id: string,
    name: string,
    location: Coordinate,
    address: string,
    tradingHours: TradingHour[] | undefined,
    icon: string,
    prices: Price[]
}
