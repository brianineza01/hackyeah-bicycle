import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
 
export const ReportsTable = pgTable(
  'reports',
  {
    id: serial('id').primaryKey(),
    email: text('email').notNull(),
    issue: text('issue').notNull(),
    longitude: text('longitude').notNull(),
    latitude: text('latitude').notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
  }
);

