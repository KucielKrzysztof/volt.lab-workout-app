/**
 * @fileoverview Calendar & Temporal Logic Orchestrator.
 * Provides a Single Source of Truth (SSOT) for date formatting
 * and the structural foundation for rendering GitHub-style activity grids
 * partitioned by months for the VOLT.LAB Analytics Dashboard.
 * @module features/analytics/utils
 */

/**
 * Universal Date Formatter (UI Standard).
 * * @description
 * Converts any valid Date or ISO-string into a strictly localized 'DD.MM.YYYY' format.
 * This function enforces a **UTC-Only Strategy** to eliminate "Day Shifting" caused
 * by browser-side timezone offsets.
 * * @param {Date | string} date - The raw date input (ISO timestamp or Date object).
 * @returns {string} A formatted string, e.g., "04.03.2026".
 * * @example
 * formatToUIDate("2026-03-04T23:50:00Z") // Always "04.03.2026" regardless of local time.
 */
export const formatToUIDate = (date: Date | string) => {
	/**
	 * Date String Construction:
	 * We use UTC methods to ensure the date is parsed identically on server and client
	 */
	const d = typeof date === "string" ? new Date(date) : date;

	const day = String(d.getUTCDate()).padStart(2, "0");
	const month = String(d.getUTCMonth() + 1).padStart(2, "0");
	const year = d.getUTCFullYear();

	return `${day}.${month}.${year}`;
};

/**
 * Activity Grid Structure Generator.
 * * @description
 * Orchestrates the creation of a 12-month matrix optimized for GitHub-style activity grids:
 * 1. **Monday-First Alignment**: Adjusts the starting position of each month to ensure Monday is the first column.
 * 2. **Localized Formatting**: Leverages 'formatToUIDate' to ensure 100% parity with database snapshots.
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
		// Core Date resolution
		const date = new Date(year, m, 1);
		const monthName = date.toLocaleString("en-US", { month: "long" });
		const daysInMonth = new Date(year, m + 1, 0).getDate();

		// Calculate offset (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
		// Formula to shift for Monday-first: (index === 0 ? 6 : index - 1)
		const firstDayIndex = new Date(year, m, 1).getDay();
		const offset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

		const days = [];
		// Fill the beginning of the month with nulls for correct grid alignment
		for (let i = 0; i < offset; i++) days.push(null);

		// 2. FILL DATA: Use the formatter for every active day
		for (let d = 1; d <= daysInMonth; d++) {
			// We use Date.UTC to prevent the constructor from applying local time-shift
			const dateObj = new Date(Date.UTC(year, m, d));
			days.push(formatToUIDate(dateObj));
		}
		months.push({ name: monthName, days });
	}
	return months;
};
