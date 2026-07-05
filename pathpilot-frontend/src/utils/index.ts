/**
 * utils.ts — general utility helpers
 */
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, format } from 'date-fns';

/** Tailwind class merger */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format date as relative time */
export function relativeTime(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

/** Format date as readable string */
export function formatDate(date: Date): string {
  return format(date, 'MMM d, yyyy');
}

/** Format date as short time */
export function formatTime(date: Date): string {
  return format(date, 'h:mm a');
}

/** Truncate text to max chars */
export function truncate(text: string, max = 60): string {
  return text.length <= max ? text : text.slice(0, max).trim() + '…';
}

/** Generate conversation title from first user message */
export function generateConversationTitle(firstMessage: string): string {
  return truncate(firstMessage, 50);
}

/** Debounce a function */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/** Copy text to clipboard */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Format number with K/M suffixes */
export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
}

/** Format currency */
export function formatSalary(amount: number, currency = 'INR'): string {
  if (currency === 'INR') {
    if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(1)}L`;
    return `₹${formatNumber(amount)}`;
  }
  return `$${formatNumber(amount)}`;
}

/** Get initials from name */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/** Generate a color from a string (deterministic) */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 65%, 55%)`;
}

/** Check if a string is a valid email */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
