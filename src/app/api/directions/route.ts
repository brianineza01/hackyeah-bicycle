import { NextResponse, type NextRequest } from "next/server";

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

  console.log(data);

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

  return NextResponse.json({
    routes: routesWithNoDuplicates,
  });
};
