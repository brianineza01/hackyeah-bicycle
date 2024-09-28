'use client'
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { CyclistMap } from "./cyclist-map";
import { Address, SelectAdress } from "./select-adress";
import { useState } from "react";
import { Button } from "@/components/ui/button";


export function CyclistComponent() {

    const [selectedTo, setSelectedTo] = useState<Address>()
    const [selectedFrom, setSelectedFrom] = useState<Address>()

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
                <Button className="max-w-[250px]">Go</Button>
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