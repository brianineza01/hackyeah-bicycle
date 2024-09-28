import { NextResponse } from "next/server";
import qs from "qs";

/**
 * 1	These roads are meant for high volume, maximum speed traffic between and through major metropolitan areas. There are very few, if any, speed changes. Access to this road is usually controlled.
 * 2	These roads are used to channel traffic to Main Roads (FRC1) for travel between and through cities in the shortest amount of time. There are very few, if any speed changes.
 * 3	These roads interconnect with First Class Roads (FRC2) and provide a high volume of traffic movement at a lower level of mobility than First Class Roads (FRC2).
 * 4	These roads provide for a high volume of traffic movement at moderate speeds between neighborhoods. These roads connect with higher Functional Class roads to collect and distribute traffic between neighborhoods.
 * 5	These roads' volume and traffic movements are below the level of any other road.
 * @param request
 * @returns
 */

export const GET = async (request: Request) => {
  const rawParams = request.url.split("?")[1];
  const params = qs.parse(rawParams);
  console.log(params);
  const response = await fetch(
    `https://data.traffic.hereapi.com/v7/incidents?in=circle:${params.long},${params.lat};r=${params.r}&locationReferencing=olr&functionalClasses=2,3,4,5`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HERE_TOKEN_KEY}`,
      },
    }
  );

  const data = await response.json();

  return NextResponse.json(data);
};
