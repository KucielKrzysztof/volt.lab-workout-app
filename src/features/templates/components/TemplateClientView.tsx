/**
 * @fileoverview Client-Side View for the Workout Templates Dashboard.
 * Manages the transition from server-side pre-rendered routine blueprints
 * to a fully interactive, cached routine management interface.
 * @module features/templates/components
 */

"use client";

import { useUser } from "@/core/providers/UserProvider";
import { useTemplates } from "../_hooks/use-templates";
import { WorkoutTemplateUI } from "@/types/templates";
import { TemplateList } from "./TemplateList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";

interface TemplatesClientViewProps {
	initialTemplates: WorkoutTemplateUI[];
}

/**
 * The primary dashboard component for managing workout routines (blueprints).
 * * @description
 * This component acts as the "Command Center" for the routines module. It implements
 * the **SSR-to-CSR Hydration Pattern**, bridging the gap between static HTML and
 * a dynamic, reactive state managed by TanStack Query.
 * * **Key Operational Features:**
 * 1. **Hydration Bridge**: Seeds the `useTemplates` hook with `initialTemplates`
 * to prevent layout shifts (CLS) and provide an instant user experience.
 * 2. **Context-Aware Querying**: Scopes all template data to the authenticated `userId`
 * to ensure secure and isolated data management.
 * 3. **Blueprint Navigation**: Provides a high-visibility entry point for the
 * `TemplateCreator` via a prominent "Create New" action.
 * 4. **Display Orchestration**: Summarizes the total number of blueprints and
 * delegates the list rendering to the optimized `TemplateList` component.
 * * @param {TemplatesClientViewProps} props - Component properties.
 * @returns {JSX.Element} The rendered routine management dashboard.
 */
export const TemplatesClientView = ({ initialTemplates }: TemplatesClientViewProps) => {
	/** * User Context:
	 * Retrieves the active user session. The `user.id` is used as a reactive
	 * dependency for the underlying template cache key.
	 */
	const { user } = useUser();

	/** * TanStack Query Hydration:
	 * Hooks into the global cache. By providing 'initialTemplates', we ensure
	 * the dashboard is populated before the first client-side effect triggers.
	 */
	const { data: templates } = useTemplates(user?.id || "", initialTemplates);

	return (
		<div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<PageHeader title="My Routines" subtitle={`Total Blueprints: ${templates?.length || 0}`} />

			<div className="mx-auto">
				<Button size="lg" asChild className="bg-primary text-primary-foreground font-black uppercase italic tracking-widest">
					<Link href="/dashboard/templates/create">
						<Plus className="mr-2 h-4 w-4" /> Create New
					</Link>
				</Button>
			</div>
			<TemplateList templates={templates || []} />
		</div>
	);
};
