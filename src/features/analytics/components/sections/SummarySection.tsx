interface StatCardProps {
	label: string;
	value: string | number;
}

const StatCard = ({ label, value }: StatCardProps) => (
	<div className="bg-secondary/10 border border-white/5 rounded-xl p-4 flex flex-col gap-1">
		<p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{label}</p>
		<p className="text-xl font-black italic tracking-tight text-foreground">{value}</p>
	</div>
);

interface SummarySectionProps {
	stats: {
		workouts: number;
		duration: string;
		exercises: number;
		sets: number;
		reps: string;
		volume: string;
	};
}

/**
 * Displays a grid of key performance indicators (KPIs).
 * Provides a high-level overview of total volume, sets, reps, and duration.
 */

export const SummarySection = ({ stats }: SummarySectionProps) => {
	return (
		<div className="space-y-4">
			<h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Summary</h3>
			<div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 gap-3">
				<StatCard label="Workouts" value={stats.workouts} />
				<StatCard label="Duration" value={stats.duration} />
				<StatCard label="Exercises" value={stats.exercises} />
				<StatCard label="Sets" value={stats.sets} />
				<StatCard label="Reps" value={stats.reps} />
				<StatCard label="Volume" value={stats.volume} />
			</div>
		</div>
	);
};
