/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";
import { useEffect, useState } from "react";
import { decodePolyline } from "../../lib/utils";
import RouteInfo from "./RouteInfo";

const colors = [
  "#FF0000", // Red
  "#00FF00", // Green
  "#0000FF", // Blue
  "#FFFF00", // Yellow
  "#FF00FF", // Magenta
  "#00FFFF", // Cyan
  "#800000", // Maroon
  "#808000", // Olive
  "#008000", // Green
  "#008080", // Teal
  "#000080", // Navy
  "#800080", // Purple
];

const position: LatLngExpression = [53.125578, 17.991885];

export function CyclistMap({
  routes,
}: {
  routes: {
    [key: string]: any;
    geometry: string;
  }[];
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<number>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Render nothing until component is mounted
  }

  console.log(selectedRoute);

  return (
    <MapContainer
      className="w-full h-full bg-slate-800 "
      center={position}
      zoom={10}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>

      {routes.map((route, idx) => (
        <div key={idx}>
          {route?.flow?.map((f: any) => (
            <>
              <Polyline
                key={f?.id}
                pathOptions={{
                  color: selectedRoute === idx ? "#388e3c" : "grey",
                }}
                positions={f?.location?.shape?.links?.map(
                  (link: any) => link.points
                )}
                eventHandlers={{
                  click: () => console.log("Clicked!"),
                }}
              />
            </>
          ))}

          <Polyline
            key={route.id}
            pathOptions={{ color: colors[idx] }}
            positions={decodePolyline(route.geometry, false)}
          />
        </div>
      ))}

      {routes.length > 0 && (
        <div
          className="z-[500] absolute left-[5vw] top-[25vh] h-[70vh] w-[40vw]"
          onScroll={(e) => e.stopPropagation()}
        >
          <RouteInfo
            routeData={routes[selectedRoute ?? 0]}
            setNextRoute={() =>
              setSelectedRoute((selected: number) =>
                selected === routes.length - 1 ? 0 : selected + 1
              )
            }
            disabledNext={selectedRoute === routes.length - 1}
            disabledPrevious={selectedRoute === 0}
            setPreviousRoute={() =>
              setSelectedRoute((selected: number) =>
                selected === 0 ? routes.length - 1 : selected - 1
              )
            }
          />
        </div>
      )}
    </MapContainer>
  );
}
