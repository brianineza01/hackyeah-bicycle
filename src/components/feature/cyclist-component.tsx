"use client";
// import { CyclistMap } from "./cyclist-map";
import { Address, SelectAddress } from "./select-adress";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ReportModel from "./model";
import dynamic from "next/dynamic";
import { useMutation } from "@tanstack/react-query";

// Import your component dynamically and disable SSR
const CyclistMap = dynamic(
  () => import("./cyclist-map").then((mod) => mod.CyclistMap),
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
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          console.error("Failed to get geolocation:", error);
          reject(new Error("Failed to get geolocation"));
        }
      );
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
}

async function fetchLocation(): Promise<
  SuccessfulGeolocation | UnsuccessfulGeolocation
> {
  if (typeof window === "undefined") {
    // Return an error if executed server-side
    return { isError: true };
  }

  try {
    const coords = await getGeolocation();
    console.log("Current Coordinates:", coords);
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
    const [isMuted, setIsMuted] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const [routes, setRoutes] = useState<any>();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ from, to }: { from: string; to: string }) => {
      const resp = await fetch("/api/directions", {
        method: "POST",
        body: JSON.stringify({
          origin: from,
          destination: to,
        }),
      });
      const data = await resp.json();
      return data;
    },

    onSuccess: (data) => {
      setRoutes(data?.routes);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  console.log("directions: ", routes);
  const handleOpen = async () => {
    setOpen(true);

    if (typeof window !== "undefined") {
      // This code only runs on the client side
      console.log(window.innerWidth);
      const resp = await fetchLocation();
      if (resp.isError) {
        console.log("Error fetching location");
      } else if (resp.coords) {
        setAddress(resp.coords);
        console.log("Coordinates fetched:", resp.coords);
      }
    }

    const toggleMute = () => {
        setIsMuted(!isMuted);
        // Here you would add the actual mute/unmute functionality
        console.log(isMuted ? "Unmuted" : "Muted");
    };

  return (
    <div>
      {/* Map */}
      <div className="w-full h-full bg-slate-800 absolute z-10">
        <CyclistMap routes={routes ?? []} />
      </div>
      {/* upper controller / input */}
      <div className="z-20 absolute top-0 left-0 right-0 bg-white shadow-md rounded-md p-4 m-2 md:w-1/2 lg:w-1/3 xl:w-1/4">
        <div className="flex flex-col gap-4">
          <SelectAddress onSelect={setSelectedFrom} />
          <SelectAddress onSelect={setSelectedTo} />
          <Button
            onClick={() =>
              mutate({
                from: `${selectedFrom?.lon},${selectedFrom?.lat}`,
                to: `${selectedTo?.lon},${selectedTo?.lat}`,
              })
            }
            className="max-w-[250px] bg-[#4caf50] hover:bg-[#388e3c] transition-colors duration-200"
          >
            {isPending ? "Loading..." : "Go"}
          </Button>
        </div>
      </div>

            {/* lower controller */}
            <div className="z-30 absolute bottom-1/2 left-0 right-0  rounded-md p-4 m-2">
                {/* Sound/Speaker button */}
                <span className="absolute right-5 bottom-16 text-white">
                    <button className="p-4 rounded-full bg-gray-500 bg-[#4caf50] hover:bg-[#388e3c] transition-colors duration-200" onClick={toggleMute}>
                        {isMuted ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                            </svg>
                        )}
                    </button>
                </span>

                {/* Existing Report Accident button */}
                <span className="absolute right-5 text-white">
                    <button className="p-4 rounded-full bg-[#4caf50] hover:bg-[#388e3c] transition-colors duration-200" onClick={() => open ? handleClose() : handleOpen()}>
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
}