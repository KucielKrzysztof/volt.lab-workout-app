export const AnalyticsHeader = ({ children }: { children: React.ReactNode }) => {
	return (
		<header className="sticky top-0 z-10 bg-background/95 backdrop-blur pb-4 pt-2 ">
			<div className="flex flex-col items-center gap-4">
				<div className="text-center">
					<h1 className="text-2xl font-black tracking-tighter italic uppercase">Analytics</h1>
					<p className="text-[10px] text-muted-foreground uppercase tracking-widest">KEEP IT UP!</p>
				</div>
				{children}
			</div>
		</header>
	);
};
