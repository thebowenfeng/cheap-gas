import type {GasStation} from "../api/types.ts";
import { type Map, Marker } from 'maplibre-gl';
import {type FC, useEffect, useState} from "react";
import {createPortal} from "react-dom";

interface StationMarkerProps {
    station: GasStation,
    map: Map
}

const prettifyUnixTimestamp = (timestamp: number) => {
    const now = Date.now() / 1000;
    const difference = now - (timestamp / 1000);

    if (difference > 86400) {
        return `${(difference / 86400).toFixed(1)} days ago`
    } else if (difference > 3600) {
        return `${Math.round(difference / 3600)} hours ago`
    }
    return `${Math.round(difference / 60)} minutes ago`
}

export const StationMarkerView = ({ station }: { station: GasStation }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <div className="station-pop-up-container">
            {isOpen && (
                <div className="station-pop-up">
                    <div className="station-pop-up-heading">
                        <h2>{station.name}</h2>
                        <h1 onClick={() => setIsOpen(false)}>X</h1>
                    </div>
                    <p>{station.address}</p>{station.prices.map((price) => (
                        <div className="station-price">
                            <h4>{price.type}: ${price.amount}</h4>
                            <p>({prettifyUnixTimestamp(price.updated)})</p>
                        </div>
                    ))}
                </div>
            )}
            <img
                src={`http://localhost:8080/icons/${station.icon}`}
                height="35vh"
                width="auto"
                onClick={() => setIsOpen(!isOpen)}
                className="station-pop-up-img"
            />
        </div>
    )
}

export const StationMarker: FC<StationMarkerProps> = ({ station, map }) => {
    const container = document.createElement('div');

    useEffect(() => {
        const marker = new Marker({
           element: container,
           anchor: 'bottom'
       }).setLngLat([station.location.longitude, station.location.latitude]).addTo(map);

        return () => {
           marker.remove();
       };
    }, []);

    return createPortal(
        <StationMarkerView station={station} />,
        container
    );
}