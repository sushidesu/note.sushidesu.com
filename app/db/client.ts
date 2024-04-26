import { binding } from "cf-bindings-proxy";
import { drizzle } from "drizzle-orm/d1";
import type { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";
import type * as schema from "../db/schema";

type DB = BaseSQLiteDatabase<"async", unknown, typeof schema>;

let instance: DB | undefined;

export const database = (): DB => {
  if (instance !== undefined) {
    return instance;
  }
  instance = drizzle(binding<D1Database>("DB"));
  return instance;
};
