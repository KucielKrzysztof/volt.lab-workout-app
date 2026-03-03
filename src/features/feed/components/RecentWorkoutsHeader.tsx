/**
 * Motivation-focused header for the recent activity section.
 */
export const RecentWorkoutsHeader = () => {
	return (
		<header className="flex flex-col mb-8 gap-3 w-full">
			<div className="text-left">
				<h2 className="text-3xl font-extrabold tracking-tighter uppercase">
					Your Trainings <span>🔥</span>
				</h2>
				<p className="text-muted-foreground text-sm uppercase tracking-widest">Recent activity</p>
			</div>
		</header>
	);
};
