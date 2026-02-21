"use client";

import { ErrorState } from "@/components/ui/ErrorState";

/**
 * Error Boundary for the Dashboard.
 * Automatically catches and isolates runtime errors within the /dashboard route tree.
 * * @param {Error} error - The caught error object.
 * @param {Function} reset - Next.js function to attempt re-rendering the segment.
 */
export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
	return (
		<div className="flex min-h-[60vh] w-full items-center justify-center">
			<ErrorState title="Dashboard Error" message={error.message || "A critical error occurred in the dashboard segment."} onRetry={() => reset()} />
		</div>
	);
}
