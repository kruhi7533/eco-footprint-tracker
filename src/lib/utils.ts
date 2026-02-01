import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the current date in YYYY-MM-DD format
 * This gets the current local date (not UTC) to match user expectations
 */
export function getCurrentUTCDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const result = `${year}-${month}-${day}`;
  
  // Debug logging
  console.log('Current date debug:', {
    now: now.toString(),
    year,
    month,
    day,
    result
  });
  
  return result;
}

/**
 * Format a date string for display in the user's local timezone
 * @param dateStr - Date string in YYYY-MM-DD format
 * @returns Formatted date string
 */
export function formatDateForDisplay(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
