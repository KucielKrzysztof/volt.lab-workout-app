/**
 * @fileoverview Calendar generation logic for activity heatmaps.
 * Provides the structural foundation for rendering GitHub-style contribution grids
 * partitioned by months for the VOLT.LAB Analytics Dashboard.
 * @module features/analytics/utils
 */

/**
 * Generates a comprehensive 12-month data structure for a specific year, optimized for activity tracking grids.
 * * @description
 * This utility orchestrates the creation of a visual calendar grid. It accounts for:
 * 1. **Monday-First Alignment**: Adjusts the starting position of each month to ensure Monday is the first column.
 * 2. **Localized Formatting**: Converts all active days into `DD.MM.YYYY` strings to match the application's global display format.
 * 3. **Grid Padding**: Injects `null` values at the beginning of each month's array to align the first day with its correct weekday column.
 * * @param {number} year - The target year for which the calendar structure should be generated (e.g., 2026).
 * @returns {[]} An array of 12 month objects, each containing its name and aligned day strings.
 * * @example
 * // For a month starting on a Wednesday (index 3):
 * // generateYearStructure(2026) -> [null, null, "01.01.2026", "02.01.2026", ...]
 * * @example
 * const year2026 = generateYearStructure(2026);
 * console.log(year2026[0].name); // "January"
 * console.log(year2026[0].days[0]); // null (if Jan 1st is not Monday)
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

		/**
		 * Date String Construction:
		 * Iterates through the month days and formats them as DD.MM.YYYY.
		 * This specific format is critical for matching with WorkoutUI.displayDate.
		 */
		for (let d = 1; d <= daysInMonth; d++) {
			const day = String(d).padStart(2, "0");
			const month = String(m + 1).padStart(2, "0");
			days.push(`${day}.${month}.${year}`);
		}
		months.push({ name: monthName, days });
	}
	return months;
};
