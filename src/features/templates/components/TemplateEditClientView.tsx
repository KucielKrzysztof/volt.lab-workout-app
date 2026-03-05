/**
 * @fileoverview Template Editor Client Orchestrator.
 * Facilitates high-speed routine modification by leveraging the existing
 * TanStack Query cache to provide an "Instant-On" editing experience.
 * @module features/templates/components
 */
"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { TemplateCreator } from "@/features/templates/components/TemplateCreator";
import { WorkoutTemplateUI } from "@/types/templates";
import { useUser } from "@/core/providers/UserProvider";
import { useEffect } from "react";

/**
 * TemplateEditClientView Component.
 * * @description
 * Acts as the dedicated view controller for the template editing flow.
 * Instead of triggering redundant API round-trips, it extracts the target
 * blueprint directly from the synchronized global cache.
 * * **Architectural Pillars:**
 * 1. **Cache Extraction**: Accesses the `["templates", userId]` query key to retrieve
 * pre-mapped `WorkoutTemplateUI` objects.
 * 2. **Side-Effect Guard**: Utilizes `useEffect` for secure navigation redirects,
 * preventing the "Router update during render" race condition.
 * 3. **State Hydration**: Passes the resolved blueprint to the `TemplateCreator`
 * to initialize the form state in `edit` mode.
 * * **Data Flow:**
 * {Query Cache} > {find(id)} > {initialData} > {TemplateCreator (Form Sync)}
 * * @returns {JSX.Element | null} The orchestrated editor interface or a redirecting null state.
 */
export const TemplateEditClientView = () => {
	const { id } = useParams();
	const { user } = useUser();
	const queryClient = useQueryClient();
	const router = useRouter();

	/** * Cache Resolution:
	 * Targets the specific scoped cache created by 'useTemplates'.
	 * If the user performs a hard refresh (F5), this data will initially be undefined.
	 */
	const templates = queryClient.getQueryData<WorkoutTemplateUI[]>(["templates", user?.id]);
	const existingTemplate = templates?.find((t) => t.id === id);

	/** * Resilience & Navigation Guard:
	 * Implements an observer effect to handle cache misses. If the data is
	 * unavailable (e.g., deep linking without previous navigation), the user
	 * is safely returned to the template library.
	 */
	useEffect(() => {
		if (!existingTemplate && user) {
			// Safe redirection outside of the render cycle.
			router.replace("/dashboard/templates");
		}
	}, [existingTemplate, user, router]);

	/** * Safety Rendering:
	 * Prevents the 'TemplateCreator' from mounting with undefined state
	 * while the navigation effect is pending.
	 */
	if (!existingTemplate) return null;

	return (
		<div className="p-4 md:p-10 max-w-4xl mx-auto space-y-8">
			<header className="sticky top-0 z-10 bg-background/95 backdrop-blur pb-4 pt-2 text-center">
				<h1 className="text-2xl font-black tracking-tighter italic uppercase">
					Edit <span className="text-primary">Blueprint</span>
				</h1>
				<p className="text-[10px] text-muted-foreground uppercase tracking-widest">Modifying: {existingTemplate?.name}</p>
			</header>

			{/* FORM ORCHESTRATOR: 
                Switches the creator to 'edit' mode and injects cached data.
            */}
			<TemplateCreator mode="edit" initialData={existingTemplate} />
		</div>
	);
};
