'use client';
// import { CyclistMap } from "./cyclist-map";
import { Address, SelectAdress } from "./select-adress";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import dynamic from 'next/dynamic'

// Import your component dynamically and disable SSR
const CyclistComponentNoSSR = dynamic(
    () => import('./cyclist-map').then((mod) => mod.CyclistMap),
    { ssr: false }
);



// Define the type for the coordinates
export interface GeolocationCoords {
    latitude: number;
    longitude: number;
}

// Usage example
type SuccessfulGeolocation = {
    isError: false;
    coords: GeolocationCoords;
};
type UnsuccessfulGeolocation = {
    isError: true;
};

// Async function to get geolocation
export async function getGeolocation(): Promise<GeolocationCoords> {
    return new Promise((resolve, reject) => {
        if (typeof window !== 'undefined' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    resolve({ latitude, longitude });
                },
                (error) => {
                    console.error('Failed to get geolocation:', error);
                    reject(new Error('Failed to get geolocation'));
                }
            );
        } else {
            reject(new Error('Geolocation is not supported by this browser.'));
        }
    });
}

async function fetchLocation(): Promise<SuccessfulGeolocation | UnsuccessfulGeolocation> {
    if (typeof window === 'undefined') {
        // Return an error if executed server-side
        return { isError: true };
    }

    try {
        const coords = await getGeolocation();
        console.log('Current Coordinates:', coords);
        return { isError: false, coords };
    } catch (error) {
        console.error(error);
        return { isError: true };
    }
}

export function CyclistComponent() {
    const [selectedTo, setSelectedTo] = useState<Address>();
    const [selectedFrom, setSelectedFrom] = useState<Address>();

    const onClickGo = async () => {
        if (typeof window !== 'undefined') {
            // This code only runs on the client side
            console.log(window.innerWidth);
            const resp = await fetchLocation();
            if (resp.isError) {
                console.log('Error fetching location');
            } else if (resp.coords) {
                console.log('Coordinates fetched:', resp.coords);
            }
        }
    };

    return (
        <div>
            {/* Map */}
            <div className="w-full h-full bg-slate-800 absolute z-10">
                <CyclistComponentNoSSR />
            </div>
            {/* upper controller / input */}
            <div className="z-20 absolute top-0 left-0 right-0 bg-white shadow-md rounded-md p-4 m-2">
                <div className="flex flex-col gap-4">
                    <SelectAdress onSelect={setSelectedFrom}></SelectAdress>
                    <SelectAdress onSelect={setSelectedTo}></SelectAdress>
                    <Button
                        onClick={onClickGo}
                        className="max-w-[250px]">Go</Button>
                </div>
            </div>

            {/* lower controller */}
            <div className="z-30 absolute bottom-0 left-0 right-0 bg-white shadow-md rounded-md p-4 m-2">
                Here we have some stuff
                {selectedFrom?.place_id}
                {selectedTo?.place_id}
            </div>
        </div>
    );
}
