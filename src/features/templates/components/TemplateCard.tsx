/**
 * @fileoverview Orchestrated Template Card.
 * This module implements the **Orchestration Pattern**, delegating business logic
 * to a headless hook and rendering to specialized atomic sub-components.
 * @module features/templates/components
 */

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { WorkoutTemplateUI } from "@/types/templates";
import { useTemplateCard } from "../_hooks/use-template-card";
import { TemplateCardContent } from "./TemplateCardContent";
import { TemplateCardHeader } from "./TemplateCardHeader";

/**
 * TemplateCard Component.
 * * @description
 * A highly interactive card representing a reusable workout routine blueprint.
 * Refactored into an orchestrated container to improve maintainability and testability.
 * * **Architectural Pillars (Orchestrated):**
 * 1. **Logic Abstraction**: Delegates all routing, store interactions, and
 * mutations to the `useTemplateCard` headless hook.
 * 2. **Atomic Rendering**: Splits the UI into `TemplateCardHeader` (actions)
 * and `TemplateCardContent` (data visualization) to prevent "Fat Component" syndrome.
 * 3. **State Awareness**: Centrally manages the `isDeleting` overlay to provide
 * a cohesive visual experience during destructive operations.
 * 4. **Isomorphic Hydration**: Supports instant UI readiness by leveraging
 * TanStack Query's cache-first strategy through orchestrated props.
 * * @param {Object} props - Component properties.
 * @param {WorkoutTemplateUI} props.template - The flattened, UI-ready template model.
 * @returns {JSX.Element} An orchestrated card shell for routine management.
 */
export const TemplateCard = ({ template }: { template: WorkoutTemplateUI }) => {
	/** * Hook Orchestration:
	 * Extracts all business logic, ensuring the component remains "lean" and
	 * focused on layout and shell states.
	 */
	const { isDeleting, isWorkoutActive, handleStartWorkout, handleEdit, onConfirmDelete } = useTemplateCard(template);

	return (
		<Card className="bg-secondary/10 border-primary/10 hover:border-primary/30 transition-all group active:scale-[0.98] relative overflow-hidden">
			{/** * Loading Overlay:
			 * Managed at the container level to cover both header and content
			 * during the decommissioning process.
			 */}
			{isDeleting && (
				<div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
					<span className="text-[10px] font-black uppercase tracking-widest animate-pulse text-primary">Deleting Blueprint...</span>
				</div>
			)}

			<CardHeader className="p-4 pb-2">
				{/** * Action Orchestrator:
				 * Encapsulates Title, Edit, Play, and Delete triggers.
				 */}
				<TemplateCardHeader
					name={template.name}
					isDeleting={isDeleting}
					isWorkoutActive={isWorkoutActive}
					onEdit={handleEdit}
					onStart={handleStartWorkout}
					onDelete={onConfirmDelete}
				/>
			</CardHeader>

			<CardContent className="p-4 pt-0">
				{/** * Data Presenter:
				 * Pure presentational layer for exercises and muscle taxonomy.
				 */}
				<TemplateCardContent exercises={template.exercises} muscles={template.muscles} />
			</CardContent>
		</Card>
	);
};
