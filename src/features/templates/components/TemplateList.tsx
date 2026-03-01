/**
 * @fileoverview Responsive layout container for workout routine blueprints.
 * Orchestrates the display of a user's template library, handling the transition
 * between populated grid views and informative empty states.
 * @module features/templates/components
 */

import { WorkoutTemplateUI } from "@/types/templates";
import { TemplateCard } from "./TemplateCard";
import { LayoutGrid } from "lucide-react";

interface TemplateListProps {
	/** Array of mapped workout templates ready for display. */
	templates: WorkoutTemplateUI[];
}

/**
 * Renders a collection of workout templates in a responsive grid or a fallback empty state.
 * * @description
 * This component acts as the primary layout engine for the "My Routines" dashboard.
 * It ensures that the interface remains professional and helpful even when no
 * data is present, following the "Empty State First" UX principle.
 ** *Stable Iteration**: Maps the `templates` collection to individual
 * `TemplateCard` components using database-backed UUIDs (`template.id`) to
 * ensure optimal React DOM reconciliation.
 * * @param {TemplateListProps} props - Component properties.
 * @returns {JSX.Element} A responsive grid of routine cards or an empty state prompt.
 */
export const TemplateList = ({ templates }: TemplateListProps) => {
	if (templates.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-primary/10 rounded-3xl gap-4">
				<div className="p-4 bg-primary/5 rounded-full text-primary/20">
					<LayoutGrid size={48} />
				</div>
				<div className="text-center space-y-1">
					<p className="font-black uppercase italic tracking-tighter text-xl">No routines found</p>
					<p className="text-xs text-muted-foreground uppercase tracking-widest">Start by creating your first routine</p>
				</div>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{templates.map((template) => (
				<TemplateCard key={template.id} template={template} />
			))}
		</div>
	);
};
