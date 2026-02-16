export const generateYearStructure = (year: number) => {
	const months = [];
	for (let m = 0; m < 12; m++) {
		const date = new Date(year, m, 1);
		const monthName = date.toLocaleString("en-US", { month: "long" });
		const daysInMonth = new Date(year, m + 1, 0).getDate();

		// Monday first
		const firstDayIndex = new Date(year, m, 1).getDay();
		const offset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

		const days = [];
		for (let i = 0; i < offset; i++) days.push(null);
		for (let d = 1; d <= daysInMonth; d++) {
			days.push(`${year}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
		}
		months.push({ name: monthName, days });
	}
	return months;
};
