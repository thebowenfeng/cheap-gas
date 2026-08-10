import type {Coordinate} from "../common/types.ts";

interface TradingHour {
    startMinute: number,
    endMinute: number
}

interface Price {
    type: "E10" | "U91" | "DIESEL" | "PremDSL" | "U95" | "U98" | "LPG" | "TruckDSL" | "E85" | "BIODIESEL" | "AdBlue",
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