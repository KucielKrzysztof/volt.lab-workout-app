import { PersonalRecord } from "@/types/profile";
import { Trophy } from "lucide-react";

interface RecordsSectionProps {
	/** Array of personal record objects fetched from the user's profile JSONB column. */
	records: PersonalRecord[];
	/** The specific year used to filter and display relevant records. */
	year: number;
	/** Optional flag to toggle the "Hall of Fame" header with the Trophy icon. */
	showTitle?: boolean;
}

/**
 * Shared UI component for visualizing an athlete's personal bests (PRs).
 * * @description
 * This component acts as a "Hall of Fame" grid, reusable across the Profile and Analytics views.
 * It processes raw record data, applies temporal filtering based on the selected year,
 * and renders achievement cards using the signature VOLT.LAB high-contrast aesthetic.
 * * @features
 * - **Dynamic Filtering**: Automatically parses the `date` string of each record to match the active `year` prop.
 * - **Visual Feedback**: Implements staggered entry animations (`animate-in`, `zoom-in`) for a premium feel.
 * - **Graceful Empty State**: Displays a motivational dashed-border placeholder when no records are found for the given year.
 * - **Typography**: Leverages bold, black-italic styling to emphasize strength metrics (KG).
 * * @param {RecordsSectionProps} props - Component properties.
 */
export const RecordsSection = ({ records, year, showTitle = false }: RecordsSectionProps) => {
	/** * Filtering Logic:
	 * We assume the record date follows the ISO format (YYYY-MM-DD).
	 * We filter entries where the string starts with the requested year.
	 */
	const filteredRecords = records?.filter((r) => r.date.startsWith(year.toString())) || [];

	return (
		<div className="space-y-4">
			{/* OPTIONAL HEADER: Centered title with the primary brand color icon */}
			{showTitle && (
				<div className="flex items-center justify-center gap-2 px-1">
					<Trophy className="text-primary h-5 w-5" />
					<h3 className="font-black uppercase italic tracking-tighter">Hall of Fame</h3>
				</div>
			)}

			{/* SUBTITLE: Displays the context of the currently viewed records */}
			<p className="text-center text-muted-foreground italic text-sm lowercase">{`Your PR's in ${year}`}</p>

			{/* RECORDS GRID: 2-column layout for achievement cards */}
			<div className="grid grid-cols-2 gap-3">
				{filteredRecords.length > 0 ? (
					filteredRecords.map((pr) => (
						<div
							key={pr.exercise_name}
							className="p-4 rounded-xl bg-secondary/20 border border-white/5 flex flex-col justify-center animate-in fade-in zoom-in duration-300"
						>
							{/* Exercise Label: Truncated to prevent layout break on long names */}
							<p className="text-[10px] uppercase opacity-50 font-bold truncate">{pr.exercise_name}</p>

							{/* Strength Metric: Large italic weight with a primary color unit label */}
							<div className="flex items-baseline gap-1">
								<p className="text-2xl font-black italic tracking-tighter">{pr.weight}</p>
								<span className="text-[10px] font-bold uppercase text-primary">KG</span>
							</div>
						</div>
					))
				) : (
					/* EMPTY STATE: Encourages the user to start logging workouts */
					<div className="col-span-2 p-8 rounded-xl border border-dashed border-white/10 text-center">
						<p className="text-xs text-muted-foreground lowercase italic">No records established in {year}.</p>
					</div>
				)}
			</div>
		</div>
	);
};
