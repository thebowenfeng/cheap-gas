import type {GasStation} from "../api/types.ts";
import { type Map, Marker } from 'maplibre-gl';
import {type FC, useEffect, useState} from "react";
import {createPortal} from "react-dom";

interface StationMarkerProps {
    station: GasStation,
    map: Map
}

export const StationMarker: FC<StationMarkerProps> = ({ station, map }) => {
    const container = document.createElement('div');
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        const marker = new Marker({
           element: container,
           anchor: 'bottom'
       }).setLngLat([station.location.longitude, station.location.latitude]).addTo(map);

        return () => {
           marker.remove();
       };
    }, [isOpen]);

    return createPortal(
        <div className="station-pop-up-container">
            {isOpen && (
                <div className="station-pop-up">
                    <h1>{station.name}</h1>
                    <p>{station.address}</p>
                </div>
            )}
            <img
                src={`http://localhost:8080/icons/${station.icon}`}
                height="35vh"
                width="auto"
                onClick={() => setIsOpen(!isOpen)}
                className="station-pop-up-img"
            />
        </div>,
        container
    );
}