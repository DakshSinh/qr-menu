import { createAccessControl } from "better-auth/plugins/access";

const statement = {
  user: ["read", "create", "update", "delete", "ban", "impersonate"],
  restaurant: ["read", "create", "update", "delete"],
  menu: ["read", "create", "update", "delete"],
  organisation: ["read", "create", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const customer = ac.newRole({
  user: ["read"],
  restaurant: ["read"],
  menu: ["read"],
  organisation: ["read"],
});

export const owner = ac.newRole({
  user: ["read"],
  restaurant: ["read", "create", "update", "delete"],
  menu: ["read", "create", "update", "delete"],
  organisation: ["read", "create", "update", "delete"],
});

export const admin = ac.newRole({
  user: ["read", "create", "update", "delete", "ban", "impersonate"],
  restaurant: ["read", "create", "update", "delete"],
  menu: ["read", "create", "update", "delete"],
  organisation: ["read", "create", "update", "delete"],
});