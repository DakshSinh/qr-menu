import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { admin, organization } from "better-auth/plugins";
import { ac, admin as adminRole, customer, owner } from "@/auth/permissions";
import { redis } from "@/redis";
import { nextCookies } from "better-auth/next-js";
const PREFIX = "auth:";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite", // or "mysql", "sqlite"
  }),
  advanced: {
    cookiePrefix: "qr-menu",
  },
  secondaryStorage: {
    get: async (key) => {
      const value = await redis.get(`${PREFIX}${key}`);
      return value;
    },
    set: async (key, value, ttl) => {
      const prefixedKey = `${PREFIX}${key}`;
      // Always set expiration to prevent keys from staying forever
      if (ttl) {
        await redis.set(prefixedKey, value, "EX", ttl);
      } else {
        // Default TTL of 30 days
        await redis.set(prefixedKey, value, "EX", 30 * 24 * 60 * 60);
      }
    },
    delete: async (key) => {
      await redis.del(`${PREFIX}${key}`);
    },
  },
  rateLimit: {
    window: 60, // time window in seconds
    max: 100, // max requests in the window
    storage: "secondary-storage", // Use the Redis instance you already configured
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  session: {
    freshAge: 0,
    cookieCache: {
      enabled: true,
      maxAge: 24 * 60 * 60, // Cache duration set to 1 day (86400 seconds)
    },
  },
  plugins: [
    admin({
      ac,
      defaultRole: "customer",
      adminRoles: ["admin"],
      roles: {
        customer,
        owner,
        adminRole,
      },
    }),
    nextCookies(),
    organization(),
  ],
});

export type Auth = typeof auth;
