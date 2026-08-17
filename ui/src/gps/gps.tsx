import type {Coordinate} from "../common/types.ts";
import {useEffect, useState} from "react";
import {calcLongLatDistance} from "../common/utils.ts";

type GPState = Coordinate & { accuracy: number }

interface GPSProps {
    onLocationChange: (coords: Coordinate) => void;
    onError: () => void;
    interval: number;
}



export const GPS = ({ onLocationChange, onError, interval }: GPSProps) => {
    const [current, setCurrent] = useState<GPState | undefined>(undefined);

    const getCurrentLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const newPos = {
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                };
                if (current !== undefined) {
                    const difference = calcLongLatDistance({
                        longitude: current?.longitude,
                        latitude: current?.latitude
                    }, newPos);
                    // Only update if difference is outside the accuracy range
                    if (difference && (difference > current.accuracy || difference > pos.coords.accuracy)) {
                        onLocationChange(newPos);
                        setCurrent({ ...newPos, accuracy: pos.coords.accuracy });
                    }
                } else {
                    onLocationChange(newPos);
                    setCurrent({ ...newPos, accuracy: pos.coords.accuracy });
                }
            }, () => {
                onError();
            })
        } else {
            onError();
        }
    }

    useEffect(() => {
        const intervalId = setInterval(getCurrentLocation, interval);
        return () => clearInterval(intervalId);
    }, [getCurrentLocation]);

    return null;
}