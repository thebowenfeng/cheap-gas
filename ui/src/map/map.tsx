import { startTransition, Suspense, use, useEffect, useRef, useState} from 'react';
import { Map, setWorkerUrl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import {searchGasStations} from "../api/client.ts";
import {StationMarker} from "./marker.tsx";
import {debounce} from "../common/utils.ts";
import type {GasStation} from "../api/types.ts";
import type {FuelType} from "../common/types.ts";

setWorkerUrl(workerUrl);

interface MarkerListProps {
    getStationRequest: Promise<GasStation[] | undefined>,
    map: Map,
    mapFilter?: MapFilter
}

interface MapFilter {
    gasTypeFilter?: FuelType
}

interface MapComponentProps {
    mapFilter?: MapFilter;
}

const MarkerList = ({ getStationRequest, map, mapFilter }: MarkerListProps) => {
    const result = use(getStationRequest);

    const filterGasStation = (gasStation: GasStation) => {
        if (mapFilter) {
            if (mapFilter.gasTypeFilter) {
                return gasStation.prices.some((price) => price.type === mapFilter.gasTypeFilter);
            }
        }
        return true;
    }

    return map && result?.filter(filterGasStation).map((station) => {
        const stationCopy = {...station};
        if (mapFilter) {
            if (mapFilter.gasTypeFilter) {
                stationCopy.prices = station.prices.filter((price) => price.type === mapFilter.gasTypeFilter);
            }
        }

        return <StationMarker station={stationCopy} map={map} key={station.id} />
    })
};

export const MapComponent = ({ mapFilter }: MapComponentProps) => {
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
                    <MarkerList getStationRequest={getStationRequest} map={map} mapFilter={mapFilter} />
                )}
            </Suspense>
        </>
    );
};
