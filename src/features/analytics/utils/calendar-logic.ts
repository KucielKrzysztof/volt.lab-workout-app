/**
 * Utility to generate a comprehensive year data structure for activity tracking.
 * * Each month includes its name and an array of days.
 * * Days are represented as ISO strings (YYYY-MM-DD) or null (for padding) -- that changed.
 * * Uses Monday as the first day of the week.
 * * @param year - The year to generate the structure for.
 * @returns Array of month objects containing name and day strings.
 */
export const generateYearStructure = (year: number) => {
	const months = [];
	for (let m = 0; m < 12; m++) {
		const date = new Date(year, m, 1);
		const monthName = date.toLocaleString("en-US", { month: "long" });
		const daysInMonth = new Date(year, m + 1, 0).getDate();

		// Calculate offset to ensure Monday is the first day of the week
		const firstDayIndex = new Date(year, m, 1).getDay();
		const offset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

		const days = [];
		// Fill the beginning of the month with nulls for correct grid alignment
		for (let i = 0; i < offset; i++) days.push(null);

		// Change to DD.MM.YYYY
		for (let d = 1; d <= daysInMonth; d++) {
			const day = String(d).padStart(2, "0");
			const month = String(m + 1).padStart(2, "0");
			days.push(`${day}.${month}.${year}`);
		}
		months.push({ name: monthName, days });
	}
	return months;
};
