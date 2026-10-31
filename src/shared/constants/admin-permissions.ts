export const ADMIN_PERMISSIONS = [
  "dashboard", "notifications", "users", "wallet-types", "subscription-plans",
  "contacts", "payments", "governorates", "court-types", "courts", "floors",
  "floor-names", "office-types", "offices", "settings", "policies", "analytics",
] as const;

export type AdminPermission = typeof ADMIN_PERMISSIONS[number];

