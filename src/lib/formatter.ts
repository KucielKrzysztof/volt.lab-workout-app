export const formatDuration = (totalSeconds: number) => {
	if (totalSeconds <= 0) return "0m";

	const days = Math.floor(totalSeconds / 86400);
	const hours = Math.floor((totalSeconds % 86400) / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);

	const parts = [];

	if (days > 0) parts.push(`${days}d`);
	if (hours > 0) parts.push(`${hours}h`);
	if (minutes > 0 || parts.length === 0) parts.push(`${minutes}m`);

	// Łączymy w stringa, np. "12d 4h 20m" lub "1h 45m"
	return parts.join(" ");
};

/**
 * Formats training volume into a readable string (tons and kilograms).
 * Example: 20500 -> "20t 500kg"
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
