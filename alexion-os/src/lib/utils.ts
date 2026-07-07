import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Convert a DB row (snake_case) to an AlexionUser (camelCase). */
export function mapUserRow(row: Record<string, unknown>) {
  return {
    id:           row.id as string,
    username:     row.username as string,
    displayName:  row.display_name as string,
    alexionEmail: row.alexion_email as string,
    country:      row.country as string,
    avatarUrl:    (row.avatar_url as string) ?? null,
    storageUsed:  (row.storage_used as number) ?? 0,
    storageLimit: (row.storage_limit as number) ?? 5368709120,
    status:       (row.status as "active" | "suspended" | "deleted") ?? "active",
    theme:        (row.theme as "dark" | "light") ?? "dark",
    wallpaper:    (row.wallpaper as string) ?? null,
    lastLogin:    (row.last_login as string) ?? null,
    createdAt:    row.created_at as string,
    updatedAt:    row.updated_at as string,
  };
}
