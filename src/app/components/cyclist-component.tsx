'use client'
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { CyclistMap } from "./cyclist-map";
import { Address, SelectAdress } from "./select-adress";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GeolocationCoords, getGeolocation } from "@/lib/utils";

// Usage example
type SuccessfulGeolocation = {
    isError: false;
    coords: GeolocationCoords;
}
type UnsuccessfulGeolocation = {
    isError: true;
    // chords: never;
}

async function fetchLocation(): Promise<SuccessfulGeolocation | UnsuccessfulGeolocation> {
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


    // Call the usage example function




    const [selectedTo, setSelectedTo] = useState<Address>()
    const [selectedFrom, setSelectedFrom] = useState<Address>()

    const onClickGo = async () => {
        const resp = await fetchLocation()
        if (resp.isError) {
            console.log('Error fetching location');
        } else if (resp.coords) {
            console.log('Coordinates fetched:', resp.coords);
        }
    }

    return (<div>

        {/* Map */}
        < div className="w-full h-full bg-slate-800 absolute z-10" >
            <CyclistMap />
        </div >
        {/* upper controller / input */}
        < div className="z-20 absolute top-0 left-0 right-0 bg-white shadow-md rounded-md p-4 m-2" >
            <div className="flex flex-col gap-4">

                <SelectAdress onSelect={setSelectedFrom}></SelectAdress>
                <SelectAdress onSelect={setSelectedTo}></SelectAdress>
                <Button onClick={onClickGo} className="max-w-[250px]">Go</Button>
            </div>
        </div >


        {/* lover controller  */}
        < div className="z-30 absolute bottom-0 left-0 right-0 bg-white shadow-md rounded-md p-4 m-2" >
            Her we have some stfuff
            {selectedFrom?.place_id}
            {selectedTo?.place_id}
        </div>
    </div >)
}