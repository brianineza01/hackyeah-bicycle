'use client';
// import { CyclistMap } from "./cyclist-map";
import { Address, SelectAdress } from "./select-adress";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ReportModel from "./model";
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
                    console.log(position)
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
    const [open, setOpen] = useState(false);
    const [address, setAddress] = useState({});

    const handleClose = () => {
        setOpen(false);

    }

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
    const handleOpen = async () => {
        setOpen(true);

        if (typeof window !== 'undefined') {
            // This code only runs on the client side
            console.log(window.innerWidth);
            const resp = await fetchLocation();
            if (resp.isError) {
                console.log('Error fetching location');
            } else if (resp.coords) {
                setAddress(resp.coords);
                console.log('Coordinates fetched:', resp.coords);
            }
        }
    }

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
            <div className="z-30 absolute bottom-1/2 left-0 right-0  rounded-md p-4 m-2">
                {/* Wrap with <span> and use absolute positioning */}
                <span className="absolute right-5 text-yellow-500">
                    <button className="p-4 rounded-full bg-gray-500" onClick={() => open ? handleClose() : handleOpen()}>
                        {open ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                            </svg>
                        )}
                    </button>
                </span>
                <ReportModel open={open} handleClose={handleClose} address={address}  />
            </div>
        </div>
    );
}
