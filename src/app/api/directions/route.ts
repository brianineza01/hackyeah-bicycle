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
  console.log("data: ", data);
  const errors = responses
    .filter((result) => result.status === "rejected")
    .map((result) => result.reason);

  console.log("errors", errors);

  const routes = data.reduce(
    (acc, route) => [...acc, ...(route?.routes ?? [])],
    [] as any[]
  );

  const routesWithNoDuplicates = routes.reduce((acc: any[], route: any) => {
    const isDuplicate = acc.some(
      (route: any) =>
        route.distance === route.summary.distance ||
        route.duration === route.summary.duration
    );

    if (!isDuplicate) {
      acc.push(route);
    }

    return acc;
  }, [] as any[]);

  console.log("Routes with no duplicates", routesWithNoDuplicates);
  const routesWithFlow = await getFlowForAllRoutes(routesWithNoDuplicates);
  console.log("Routes with flow", routesWithFlow);

  return NextResponse.json({ routes: routesWithFlow });
};

const getFlow = async (path: string) => {
  const response = await fetch(`https://data.traffic.hereapi.com/v7/flow}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.HERE_TOKEN_KEY}`,
    },
    body: JSON.stringify({
      locationReferencing: ["shape", "tmc"],
      in: {
        type: "corridor",
        corridor: path,
        radius: 100,
      },
    }),
  });

  const data = await response.json();
  return data;
};

async function getFlowForAllRoutes(routes: any[]) {
  const routesWithFlow = await Promise.all(
    routes.map(async (route) => {
      const polyline = decodePolyline(route.geometry, false);

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
      console.log(
        "flow errors ",
        flowResults
          .filter((pResult) => pResult.status === "rejected")
          .map((pResult) => pResult.reason)
      );
      const flow = flowResults
        .filter((pResult) => pResult.status === "fulfilled")
        .map((pResult: any) => pResult.value)
        .flat()
        .reduce((acc: any, curr: any) => {
          return [...acc, ...(curr?.results ?? [])];
        }, []);

      console.log("flow", flow);

      return { flow_length: flow.length, flow, ...route };
    })
  );

  return routesWithFlow;
}

// Usage in the POST function:
