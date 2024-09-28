import { NextResponse  } from "next/server";
import { db } from '../drizzle/db';
import { ReportsTable } from '../drizzle/schema';

export const POST = async (request: Request ) => {
    const { email, issue, longitude, latitude } = await request.json();
    try {
        const res = await db.insert(ReportsTable).values({ email, issue, longitude, latitude  }).returning();
        return NextResponse.json(res);
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error  }, { status: 404 })
    }
};
