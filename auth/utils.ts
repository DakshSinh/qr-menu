// Check if user has a specific role
export function hasRole(user: any, role: string | string[]) {
  if (!user) return false;
  const roles = Array.isArray(role) ? role : [role];
  return roles.includes(user.role);
}

// Simple permission check based on role
export function checkPermission(user: any, resource: string, action: string) {
  if (!user) return false;

  // Admin has all permissions
  if (user.role === "admin") return true;

  // Owner permissions
  if (user.role === "owner") {
    const ownerResources = ["restaurant", "menu", "order", "organisation"];
    if (ownerResources.includes(resource)) {
      return ["create", "read", "update", "delete"].includes(action);
    }
    return action === "read"; // Owners can read other resources
  }

  // Customer has read-only access
  if (user.role === "customer") {
    return action === "read";
  }

  return false;
}
