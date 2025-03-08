import { adminClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { ac, customer, owner, admin } from "@/auth/permissions";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000", // the base url of your auth server
  plugins: [
    adminClient({
      ac,
      roles: {
        customer,
        owner,
        admin,
      },
    }),
    organizationClient(),
  ],
});
