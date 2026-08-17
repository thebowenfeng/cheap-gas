import {startTransition, Suspense, use, useEffect, useMemo, useRef, useState} from 'react';
import {GeolocateControl, Map, setWorkerUrl} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import {searchGasStations} from "../api/client.ts";
import {StationMarker} from "./marker.tsx";
import {calcLongLatDistance, debounce} from "../common/utils.ts";
import type {GasStation} from "../api/types.ts";
import type {Coordinate, FuelType} from "../common/types.ts";

setWorkerUrl(workerUrl);

interface MarkerListProps {
    getStationRequest: Promise<GasStation[] | undefined>,
    map: Map,
    mapFilter?: MapFilter
}

interface MapFilter {
    gasTypeFilter?: FuelType
    gpsLocationFilter?: Coordinate
}

interface MapComponentProps {
    mapFilter?: MapFilter;
}

const DISTANCE_BUCKETS = [1000, 2000, 4000, 8000, 16000];
const findLeastBucket = (distance: number) => {
    return DISTANCE_BUCKETS.filter((dist) => distance <= dist);
}

const MarkerList = ({ getStationRequest, map, mapFilter }: MarkerListProps) => {
    const result = use(getStationRequest);
    const gpsFiltered = useMemo(() => {
        if (!mapFilter?.gpsLocationFilter) {
            return result;
        }
        const distanceBucketMap: Record<number, {
            cheapest: GasStation | undefined,
            cheapestDistance: number | undefined
        }> = DISTANCE_BUCKETS.reduce((prev, curr) => ({
            ...prev,
            [curr]: {
                cheapest: undefined,
                cheapestDistance: undefined
            }
        }), {});

        result?.forEach((station) => {
            const distance = calcLongLatDistance(station.location, mapFilter.gpsLocationFilter!);
            if (distance === undefined) {
                return;
            }

            const buckets = findLeastBucket(distance);
            if (buckets) {
                buckets.map((bucket) => distanceBucketMap[bucket]).forEach((mapEntry) => {
                    const prevFuelData = mapEntry.cheapest?.prices.find((price) => mapFilter.gasTypeFilter ? price.type === mapFilter.gasTypeFilter : price.type === 'U91');
                    const currFuelData = station.prices.find((price) => mapFilter.gasTypeFilter ? price.type === mapFilter.gasTypeFilter : price.type === 'U91');
                    if (currFuelData && (
                        prevFuelData === undefined ||
                        currFuelData.amount < prevFuelData.amount ||
                        (
                            currFuelData.amount === prevFuelData.amount &&
                            (
                                mapEntry.cheapestDistance === undefined ||
                                distance < mapEntry.cheapestDistance
                            )
                        )
                    )) {
                        mapEntry.cheapest = station;
                        mapEntry.cheapestDistance = distance;
                    }
                });
            }
        });

        const finalResults = Object.values(distanceBucketMap).map((val) => val.cheapest).filter((val) => val !== undefined);
        return [...new window.Map(finalResults.map((station) => [station.id, station])).values()];
    }, [result, mapFilter?.gpsLocationFilter, mapFilter?.gasTypeFilter])

    const filterGasStation = (gasStation: GasStation) => {
        if (mapFilter) {
            if (mapFilter.gasTypeFilter) {
                return gasStation.prices.some((price) => price.type === mapFilter.gasTypeFilter);
            }
        }
        return true;
    }

    return map && gpsFiltered?.filter(filterGasStation).map((station) => {
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
        let map: Map;
        const initMap = (initialCoords: Coordinate | undefined) => {
            if (!containerRef.current) {
                return;
            }

            map = new Map({
                container: containerRef.current,
                style: 'https://tiles.openfreemap.org/styles/bright',
                center: initialCoords ? [initialCoords.longitude, initialCoords.latitude] : [144.9631, -37.8136],
                zoom: 14,
            });
            map.addControl(
                new GeolocateControl({
                    positionOptions: { enableHighAccuracy: true },
                    trackUserLocation: true,
                    showUserLocation: true
                })
            );
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
        }

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => {
                initMap({ longitude: pos.coords.longitude, latitude: pos.coords.latitude });
            }, () => {
                initMap(undefined);
            })
        } else {
            initMap(undefined);
        }

        return () => map?.remove();
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
