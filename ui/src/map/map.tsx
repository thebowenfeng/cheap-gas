import { startTransition, Suspense, use, useEffect, useRef, useState} from 'react';
import { Map, setWorkerUrl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import {searchGasStations} from "../api/client.ts";
import {StationMarker} from "./marker.tsx";
import {debounce} from "../common/utils.ts";
import type {GasStation} from "../api/types.ts";

setWorkerUrl(workerUrl);

interface MarkerListProps {
    getStationRequest: Promise<GasStation[] | undefined>,
    map: Map
}

const MarkerList = ({ getStationRequest, map }: MarkerListProps) => {
    const result = use(getStationRequest);

    return map && result?.map((station) => {
        return <StationMarker station={station} map={map} key={station.id} />
    })
};

export const MapComponent = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<Map | undefined>(undefined);
    const [getStationRequest, setGetStationRequest] = useState<Promise<GasStation[] | undefined>>(Promise.resolve(undefined));

    useEffect(() => {
        if (!containerRef.current) {
            return;
        }

        const map = new Map({
            container: containerRef.current,
            style: 'https://tiles.openfreemap.org/styles/bright',
            center: [144.9631, -37.8136],
            zoom: 14,
        });
        setMap(map);

        const setBounds = () => {
            const bounds = map.getBounds();
            const topRight = bounds.getNorthEast();
            const bottomLeft = bounds.getSouthWest();
            startTransition(() => {
                setGetStationRequest(searchGasStations({
                    topRight: {
                        longitude: topRight.lng,
                        latitude: topRight.lat
                    },
                    bottomLeft: {
                        longitude: bottomLeft.lng,
                        latitude: bottomLeft.lat
                    }
                }))
            })
        }
        map.on('move', debounce(300, setBounds));

        return () => map.remove();
    }, []);

    return (
        <>
            <div ref={containerRef} className="map" />
            <Suspense>
                {map && (
                    <MarkerList getStationRequest={getStationRequest} map={map} />
                )}
            </Suspense>
        </>
    );
};
