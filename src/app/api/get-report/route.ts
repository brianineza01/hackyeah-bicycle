import { NextResponse  } from "next/server";
import { db } from '../drizzle/db';
import { ReportsTable } from '../drizzle/schema';
import { eq, and } from 'drizzle-orm';
import qs from 'qs';

export const GET = async (request: Request ) => {
    const rawParams = request.url.split('?')[1];
    const params = qs.parse(rawParams);
    try {
        const result = await db.select().from(ReportsTable)
        .where( and(eq(ReportsTable.longitude,  `${params.long}`), eq(ReportsTable.latitude, `${params.lat}`)));
        return NextResponse.json(result);
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error  }, { status: 404 })
    }
};
