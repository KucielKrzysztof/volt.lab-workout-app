interface ProgressChartsSectionProps {
	year: number;
}

/**
 * Placeholder for the future chart implementation.
 * Designed to hold visual progression data like volume trends etc... we will see!
 */
export const ProgressChartsSection = ({ year }: ProgressChartsSectionProps) => {
	return (
		<div className="pb-20 text-center text-muted-foreground italic text-sm mt-4">
			Charts for {year} coming soon...
			<div className="h-48 bg-primary/5 rounded-xl mt-4 border border-dashed border-primary/20 flex items-center justify-center">
				<span className="text-[10px] uppercase tracking-widest font-bold opacity-30">Chart Engine Pending</span>
			</div>
		</div>
	);
};
