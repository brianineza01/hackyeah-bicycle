import { NextResponse, type NextRequest } from "next/server";
import { encode } from "@here/flexpolyline";
import { decodePolyline } from "../../../lib/utils";

export const POST = async (request: NextRequest) => {
  const { origin, destination } = await request.json();

  const body = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      coordinates: [
        origin.split(",").map(Number),
        destination.split(",").map(Number),
      ],
      alternative_routes: {
        target_count: 3,
        share_factor: 0.6,
        weight_factor: 3,
      },
    }),
  };

  const buildUrl = (profile: string) =>
    `https://api.openrouteservice.org/v2/directions/${profile}?api_key=${process.env.OPEN_SERVICE_API_KEY}`;

  const profiles = [
    "cycling-road",
    "cycling-regular",
    "cycling-mountain",
    "cycling-electric",
  ];

  const responses = await Promise.allSettled(
    profiles.map((profile) => fetch(buildUrl(profile), body))
  );

  const data = await Promise.all(
    responses
      .filter((response) => response.status === "fulfilled")
      .map((response) => response.value.json())
  );

  const routes = data.reduce(
    (acc, route) => [...acc, ...route.routes],
    [] as any[]
  );

  const routesWithNoDuplicates = routes.reduce((acc: any[], route: any) => {
    const isDuplicate = acc.some(
      (route: any) =>
        route.distance === route.summary.distance &&
        route.duration === route.summary.duration
    );

    if (!isDuplicate) {
      acc.push(route);
    }

    return acc;
  }, [] as any[]);

  const polyline = decodePolyline(routesWithNoDuplicates[0].geometry, false);

  const polylineChunks = [];
  for (let i = 0; i < polyline.length; i += 300) {
    polylineChunks.push(polyline.slice(i, i + 300));
  }

  const flowPromises = polylineChunks.map(async (chunk) => {
    const encodedPolyline = encode({
      polyline: chunk,
    });

    return await getFlow(encodedPolyline);
  });

  const flowResults = await Promise.allSettled(flowPromises);
  const flow = flowResults
    .filter((pResult) => pResult.status === "fulfilled")
    .map((pResult) => pResult.value)
    .flat();

  return NextResponse.json({
    routes: routesWithNoDuplicates,
    flow,
  });
};

const getFlow = async (path: string) => {
  const response = await fetch(`https://data.traffic.hereapi.com/v7/flow?&}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.HERE_TOKEN_KEY}`,
    },
    body: JSON.stringify({
      locationReferencing: "olr",
      in: {
        type: "corridor",
        corridor: path,
        radius: 100,
      },
    }),
  });

  const data = await response.json();
  console.log(data);
  return data;
};
