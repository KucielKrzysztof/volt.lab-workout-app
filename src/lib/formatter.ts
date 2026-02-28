/**
 * @fileoverview Utility formatters for the VOLT.LAB ecosystem.
 * Handles the transformation of raw performance metrics (seconds, kilograms)
 * into human-readable strings optimized for dashboard visualization.
 * @module lib/formatter
 */

/**
 * Converts a raw duration in seconds into a partitioned human-readable string (Days, Hours, Minutes).
 * * @description
 * This function decomposes total seconds into high-level time units to prevent
 * visual clutter in the UI when displaying long-term training history.
 * * @param {number} totalSeconds - The total cumulative time in seconds recorded during a session or period.
 * @returns {string} A formatted string (e.g., "2d 4h 15m"). Returns "0m".
 * * @example
 * formatDuration(3661);   // Returns "1h 1m"
 * formatDuration(90000);  // Returns "1d 1h"
 * formatDuration(45);     // Returns "0m" (fallback for small values)
 */
export const formatDuration = (totalSeconds: number) => {
	if (totalSeconds <= 0) return "0m";

	const days = Math.floor(totalSeconds / 86400);
	const hours = Math.floor((totalSeconds % 86400) / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);

	const parts = [];

	if (days > 0) parts.push(`${days}d`);
	if (hours > 0) parts.push(`${hours}h`);
	// Minutes are shown if they exist or if no other units are present
	if (minutes > 0 || parts.length === 0) parts.push(`${minutes}m`);

	return parts.join(" ");
};

/**
 * Scales and formats training volume (kilograms) into a readable string using tons and kilograms.
 * * @description
 * Designed to handle high-tonnage progression in the Analytics Dashboard.
 * Automatically switches to ton-based notation once the volume exceeds 1,000 kg
 * to maintain UI consistency and readability.
 * * @param {number} kg - The total weight volume calculated of all completed sets.
 * @returns {string} A formatted weight string (e.g., "12t 450kg").
 * * @example
 * formatVolume(850);     // Returns "850 kg"
 * formatVolume(20500);   // Returns "20t 500kg"
 * formatVolume(1000);    // Returns "1t"
 */
export const formatVolume = (kg: number) => {
	if (kg === 0) return "0 kg";
	if (kg < 1000) return `${kg.toLocaleString()} kg`;

	const tons = Math.floor(kg / 1000);
	const remainingKg = Math.round(kg % 1000);

	const parts = [];
	if (tons > 0) parts.push(`${tons}t`);
	if (remainingKg > 0) parts.push(`${remainingKg}kg`);

	return parts.join(" ");
};
