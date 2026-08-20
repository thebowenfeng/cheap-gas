import type {GasStation} from "../api/types.ts";
import { type Map, Marker, Popup } from 'maplibre-gl';
import {type FC, useEffect, useMemo} from "react";
import {createPortal} from "react-dom";

interface StationMarkerProps {
    station: GasStation,
    map: Map,
    showPrice: boolean
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

export const StationMarkerView = ({ station, onClose }: { station: GasStation, onClose?: () => void }) => {
    return (
        <div className="station-pop-up">
            <div className="station-pop-up-heading">
                <h2>{station.name}</h2>
                {onClose && (
                    <button type="button" aria-label="Close station details" onClick={onClose}>×</button>
                )}
            </div>
            <p>{station.address}</p>{station.prices.map((price) => (
                <div className="station-price" key={`${price.type}-${price.updated}`}>
                    <h4>{price.type}: ${price.amount}</h4>
                    <p>({prettifyUnixTimestamp(price.updated)})</p>
                </div>
            ))}
        </div>
    )
}

const StationMarkerIcon = ({ station, showPrice }: { station: GasStation, showPrice: boolean }) => (
    <div className="station-icon-container">
        {showPrice && (
            <div className="station-icon-price"><h3>{station.prices[0].amount}</h3></div>
        )}
        <img
            src={`http://localhost:8080/icons/${station.icon}`}
            alt={`${station.name} marker`}
            className="station-pop-up-img"
        />
    </div>
)

export const StationMarker: FC<StationMarkerProps> = ({ station, map, showPrice }) => {
    const markerContainer = document.createElement('div');
    const popupContainer = document.createElement('div');
    const popup = useMemo(() => {
        const pup = new Popup({
            className: 'station-popup',
            closeButton: false,
            maxWidth: 'min(300px, calc(100vw - 24px))',
            offset: 35,
            padding: {top: 12, right: 12, bottom: 12, left: 12}
        });
        pup.setDOMContent(popupContainer)

        return pup;
    }, [popupContainer]);

    useEffect(() => {
        const marker = new Marker({
           element: markerContainer,
           anchor: 'bottom'
       })
            .setLngLat([station.location.longitude, station.location.latitude])
            .setPopup(popup)
            .addTo(map);

        return () => {
           marker.remove();
       };
    }, [map, markerContainer, popup, station.location.latitude, station.location.longitude]);

    return (
        <>
            {createPortal(
                <StationMarkerIcon station={station} showPrice={showPrice} />,
                markerContainer
            )}
            {createPortal(
                <StationMarkerView station={station} onClose={popup.remove} />,
                popupContainer
            )}
        </>
    );
}
