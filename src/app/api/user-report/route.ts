import { NextResponse  } from "next/server";
import { db } from '../drizzle/db';
import { ReportsTable } from '../drizzle/schema';

export const POST = async (request: Request ) => {
    const { issue,latitude, longitude } = await request.json();
    try {
        const res = await db.insert(ReportsTable).values({ email: 'fake@gmail.com', issue,latitude, longitude  }).returning();
        return NextResponse.json(res);
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error  }, { status: 404 })
    }
};
