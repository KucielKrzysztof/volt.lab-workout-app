import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind Class Merger Utility (cn).
 * Combines 'clsx' for conditional class logic and 'tw-merge' to resolve
 * Tailwind class conflicts (last class wins).
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
