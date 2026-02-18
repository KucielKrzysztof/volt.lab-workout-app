const MOCK_STREAK = 5;

export const RecentWorkoutsHeader = () => {
	return (
		<header className="flex flex-col mb-8 gap-3">
			<div className="text-left">
				<h2 className="text-3xl font-extrabold tracking-tighter uppercase">Your Trainings</h2>
				<p className="text-muted-foreground text-sm uppercase tracking-widest">Recent activity</p>
			</div>
			<div className="flex flex-col items-end text-right">
				<p className="text-xl font-black italic uppercase text-muted-foreground leading-none">
					{MOCK_STREAK} DAY STREAK {MOCK_STREAK >= 1 && <span>🔥</span>}
				</p>
			</div>
		</header>
	);
};
