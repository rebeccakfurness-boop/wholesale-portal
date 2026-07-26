import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;

let instance: Db | undefined;

// Lazy so `next build` (and any other module graph walk) doesn't require
// DATABASE_URL to be set just to collect route metadata — only an actual
// query at request time needs a real connection.
function getDb(): Db {
  if (!instance) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set — see .env.example");
    }
    const queryClient = postgres(process.env.DATABASE_URL, { max: 10 });
    instance = drizzle(queryClient, { schema });
  }
  return instance;
}

export const db: Db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver);
  },
});
