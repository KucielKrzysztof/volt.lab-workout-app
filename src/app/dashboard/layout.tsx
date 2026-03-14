import { BottomNav } from "@/features/navigation/components/BottomNav";
import { DesktopNav } from "@/features/navigation/components/DesktopNav";
import { ActiveWorkoutBanner } from "@/features/workouts/components/active/ActiveWorkoutBanner";
import React from "react";

/**
 * Dashboard-specific layout wrapper.
 * Handles responsive navigation: DesktopNav for large screens, BottomNav for mobile.
 */
export default function layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col">
			<ActiveWorkoutBanner />
			<DesktopNav />
			<main className="flex-1 w-full  mx-auto max-w-lg p-4 pb-24 md:pt-24">{children}</main>
			<BottomNav />
		</div>
	);
}
