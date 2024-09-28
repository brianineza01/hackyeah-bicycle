import { NextResponse } from "next/server";
import qs from 'qs';

export const GET = async (request: Request ) => {
    const rawParams = request.url.split('?')[1];
    const params = qs.parse(rawParams);
  console.log(params);
  const response = await fetch(
    `https://data.traffic.hereapi.com/v7/flow?in=circle:${params.log},${params.lag};r=${params.r}&locationReferencing=olr`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.HERE_TOKEN_KEY}`
      }
    }
  );

  const data = await response.json();
  console.log(data);

  return NextResponse.json(data);
};
