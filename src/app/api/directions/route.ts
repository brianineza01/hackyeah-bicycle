import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  const { origin, destination } = await request.json();

  const response = await fetch(
    `https://api.openrouteservice.org/v2/directions/cycling-regular?api_key=${process.env.OPEN_SERVICE_API_KEY}`,
    {
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
    }
  );

  console.log(response);
  const data = await response.json();

  return NextResponse.json(data);
};
