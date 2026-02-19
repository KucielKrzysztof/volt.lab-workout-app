/**
 * Displays personal bests for key lifts (e.g., Bench Press, Squat).
 * Visualizes progression in raw strength for the selected year.
 */

export const RecordsSection = ({ year }: { year: number }) => {
	// Current implementation uses placeholders for specific exercises
	return (
		<div className="pb-6 mt-4 space-y-4">
			<p className="text-center text-muted-foreground italic text-sm">{`Your PR's in ${year}`}</p>
			<div className="grid grid-cols-2 gap-3">
				<div className="p-4 rounded-lg bg-secondary/20 border border-white/5">
					<p className="text-[10px] uppercase opacity-50">Bench Press</p>
					<p className="text-xl font-black italic">120 KG</p>
				</div>
				<div className="p-4 rounded-lg bg-secondary/20 border border-white/5">
					<p className="text-[10px] uppercase opacity-50">Squat</p>
					<p className="text-xl font-black italic">160 KG</p>
				</div>
			</div>
		</div>
	);
};
