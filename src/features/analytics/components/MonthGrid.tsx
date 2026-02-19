import { cn } from "@/lib/utils";

interface MonthGridProps {
	monthName: string;
	days: (string | null)[];
	history: string[]; // ['2024-02-15', ...]
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/**
 * Renders a 7-column grid representing a single month.
 * Highlights days that exist in the workout history.
 */
export const MonthGrid = ({ monthName, days, history }: MonthGridProps) => {
	return (
		<div className="mb-6">
			<h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3 text-muted-foreground">{monthName}</h3>

			<div className="grid grid-cols-7 gap-1">
				{/* Render week day headers (Mon-Sun) */}
				{WEEKDAYS.map((d, i) => (
					<div key={i} className="text-[8px] text-center opacity-40 mb-1">
						{d}
					</div>
				))}

				{/* Render day cells or empty spacers */}
				{days.map((date, index) => {
					if (!date) return <div key={`empty-${index}`} className="aspect-square bg-transparent" />;

					const hasWorkout = history.includes(date);

					return (
						<div
							key={date}
							className={cn(
								"aspect-square rounded-[2px] border border-white/5 transition-colors",
								// Highlight cell if workout history exists for this date
								hasWorkout ? "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.4)]" : "bg-secondary/20",
							)}
							title={date}
						/>
					);
				})}
			</div>
		</div>
	);
};
