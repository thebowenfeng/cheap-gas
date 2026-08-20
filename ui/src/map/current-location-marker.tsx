import './current-location-marker.css';
import {type Map, Marker} from "maplibre-gl";
import type {Coordinate} from "../common/types.ts";
import {useEffect, useMemo, useState} from "react";
import {createPortal} from "react-dom";
import {GPS} from "../gps/gps.tsx";

interface SelfLocationMarkerProps {
    map: Map
}

interface LocationMarkerProps {
    map: Map,
    coordinate: Coordinate
}

export const LocationMarkerView = () => (
    <span
        className="current-location-marker"
        role="img"
        aria-label="Your current location"
    >
        <span className="current-location-marker__pulse current-location-marker__pulse--delayed" />
        <span className="current-location-marker__pulse" />
        <span className="current-location-marker__dot" />
    </span>
);

export const LocationMarker = ({ map, coordinate }: LocationMarkerProps) => {
    const markerContainer = useMemo(() => {
        const container = document.createElement('div');
        container.className = "current-location-marker-container";
        return container;
    }, []);


    useEffect(() => {
        const marker  = new Marker({
            element: markerContainer,
            anchor: 'bottom',
        })
            .setLngLat([coordinate.longitude, coordinate.latitude])
            .addTo(map);

        return () => {
            marker.remove();
        };
    }, [map, coordinate]);

    return createPortal(
        <LocationMarkerView />,
        markerContainer
    );
}

export const SelfLocationMarker = ({ map }: SelfLocationMarkerProps) => {
    const [currentCoordinate, setCurrentCoordinate] = useState<Coordinate | undefined>(undefined);

    return (
        <>
            {currentCoordinate && <LocationMarker map={map} coordinate={currentCoordinate} />}
            <GPS
                onLocationChange={(pos) => setCurrentCoordinate(pos)}
                onError={() => setCurrentCoordinate(undefined)}
                interval={1000}
            />
        </>
    )
}
