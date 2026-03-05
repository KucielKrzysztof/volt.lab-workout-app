/**
 * @fileoverview Presentational content body for the TemplateCard.
 * Handles the high-density visualization of exercise line-items and
 * anatomical target metadata.
 * @module features/templates/components
 */

import { Badge } from "@/components/ui/badge";
import { WorkoutTemplateUI } from "@/types/templates";

/**
 * Properties for the TemplateCardContent component.
 * @interface TemplateCardContentProps
 * @property {WorkoutTemplateUI["exercises"]} exercises - Array of exercise objects containing name and volume metrics.
 * @property {string[]} muscles - Aggregated list of primary and secondary muscle groups.
 */
interface TemplateCardContentProps {
	exercises: WorkoutTemplateUI["exercises"];
	muscles: string[];
}

/**
 * TemplateCardContent Component.
 * * @description
 * A pure presentational component that renders the "Internal Blueprint" of a routine.
 * It distills complex relational data into a readable, high-contrast list.
 * * **Visual Pillars:**
 * 1. **Volume Preview**: Displays exercises in a strictly formatted `Sets x Reps`
 * notation using a monospace font for maximum legibility.
 * 2. **Muscle Taxonomy**: Renders muscle groups as interactive-style badges,
 * providing immediate anatomical context.
 * 3. **Numbered Hierarchy**: Implements a low-opacity monospace index for
 * clear exercise sequencing.
 * * **Data Transformation Visualization:**
 * $\text{Blueprint Data} \rightarrow \text{Mapped List (UI)} + \text{Muscle Badge Cloud}$
 * * @param {TemplateCardContentProps} props - Component properties.
 * @returns {JSX.Element} The rendered content body.
 */
export const TemplateCardContent = ({ exercises, muscles }: TemplateCardContentProps) => (
	<div className="space-y-4">
		{/** * Exercise Blueprint List:
		 * Renders each movement with its intended volume.
		 * Uses truncate to maintain layout integrity on small screens.
		 */}
		<ul className="space-y-2">
			{exercises.map((ex, index) => (
				<li key={index} className="flex justify-between items-center gap-4 text-[11px] font-bold uppercase italic tracking-tight">
					<div className="flex items-center gap-2 overflow-hidden">
						<span className="text-[9px] font-mono opacity-30 shrink-0">{index + 1}.</span>
						<span className="text-foreground/80 truncate">{ex.name}</span>
					</div>
					<span className="text-primary font-mono shrink-0">
						{ex.sets}x{ex.reps}
					</span>
				</li>
			))}
		</ul>
		{/** * Anatomical Target Badges:
		 * Aggregated badges representing the physiological focus of the routine.
		 */}
		<div className="flex flex-wrap gap-1">
			{muscles.map((m) => (
				<Badge key={m} variant="outline" className="text-[9px] uppercase border-primary/20 bg-primary/5 text-muted-foreground font-bold">
					{m}
				</Badge>
			))}
		</div>
	</div>
);
