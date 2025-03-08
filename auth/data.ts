"use client";

import { authClient } from "@/auth/auth-client";
import { cache } from "react";

// Client-side session data with React cache
export const getUserData = cache(async () => {
  const { data: session } = authClient.useSession();
  return session;
});

