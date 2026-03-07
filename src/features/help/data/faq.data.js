export const faqs = [
	{
		question: "Can I create my own training routines?",
		answer:
			"Yes. The Workout Templates Manager allows you to create, edit, and delete personal blueprints. While we currently support user-defined routines, the lab is scheduled to release 'Base Templates' in future development cycles.",
	},
	{
		question: "Is access to the VOLT.LAB free?",
		answer:
			"Currently, all core training systems are free to use. We aim to keep the primary logging and analytics features accessible, though advanced premium modules may be introduced in the far future to support VOLT.LAB maintenance.",
	},
	{
		question: "How is my data handled?",
		answer:
			"The system exclusively persists data required for training logic (workout history, performance sets, and profile metadata). We do not engage in external tracking. You can monitor this in the Privacy & Security module.",
	},
	{
		question: "Is my active session safe from refreshes?",
		answer:
			"Yes. The active workout state is managed via Zustand with 'persist' middleware, synchronizing your progress with browser storage in real-time.",
	},
	{
		question: "How is 'Total Volume' calculated?",
		answer:
			"Volume is the mathematical aggregation of performance: $\\sum (weight \\times reps)$ for every completed set. We normalize large values into tons for better readability.",
	},
	{
		question: "What happens when I delete a session?",
		answer: "Purging a session triggers an atomic database-level deletion. All associated performance sets are permanently destroyed.",
	},
	{
		question: "Can I track PRs for different years?",
		answer:
			"Absolutely. Our Yearly Achievement Architecture partitions Personal Records by exercise and year, allowing you to track progression across different training seasons.",
	},
];
