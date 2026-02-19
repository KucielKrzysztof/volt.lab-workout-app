import { Loader2 } from "lucide-react";

/**
 * Full-screen loading overlay with backdrop blur.
 * Used for blocking transitions or global data fetching states.
 */
export default function GlobalLoading() {
	return (
		<div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm">
			<div className="relative flex items-center justify-center">
				<Loader2 className="h-12 w-12 animate-spin text-primary" strokeWidth={1.5} />

				<div className="absolute h-2 w-2 rounded-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.8)]" />
			</div>

			<p className="mt-4 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Loading...</p>
		</div>
	);
}
