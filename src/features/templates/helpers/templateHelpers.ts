/**
 * @fileoverview Transformation logic for training blueprints (templates).
 * Provides mapping utilities to convert nested relational data from the
 * `workout_templates` and `template_exercises` tables into flattened UI models.
 * @module features/templates/helpers
 */

import { WorkoutTemplateJoined, WorkoutTemplateUI } from "@/types/templates";

/**
 * Transforms a joined database template record into a flattened, UI-optimized object.
 * * @description
 * This mapper is responsible for distilling complex relational snapshots into a
 * format ready for immediate rendering in `TemplateCard` and `TemplateList`.
 * It performs two critical data aggregations:
 * 1. **Muscle Group Distillation**: Extracts unique target areas across all exercises in the routine.
 * 2. **Ordered Exercise Projection**: Maps and sorts nested exercise lines to maintain the intended training sequence.
 * * @param {WorkoutTemplateJoined} template - The raw relational object including joined `template_exercises` and exercise metadata.
 * @returns {WorkoutTemplateUI} A flattened object containing unique muscles, exercise counts, and sorted movement summaries.
 * * @example
 * const rawTemplate = await templateService.getTemplates(supabase, userId);
 * const uiModel = mapTemplateForUI(rawTemplate[0]);
 * console.log(uiModel.muscles); // e.g., ["Chest", "Triceps"]
 * console.log(uiModel.exerciseCount); // Total movements in routine
 */
export const mapTemplateForUI = (template: WorkoutTemplateJoined): WorkoutTemplateUI => {
	/**
	 * Access nested relationships safely.
	 * Fallback to an empty array ensures the mapper doesn't break on malformed data.
	 */
	const rels = template.template_exercises || [];

	/**
	 * Muscle Extraction:
	 * Maps through joined exercises to retrieve targeted muscle groups.
	 * Utilizes `Set` to provide a unique list for UI badges.
	 */
	const muscles = [...new Set(rels.map((re) => re.exercises?.muscle_group).filter(Boolean))] as string[];

	/** * Comprehensive Exercise Mapping:
	 * Transforms relational lines into a simplified array.
	 * Explicitly sorts by the `order` property defined during routine creation.
	 */
	const exercises = rels
		.sort((a, b) => a.order - b.order)
		.map((re) => ({
			id: re.exercise_id,
			name: re.exercises?.name || "Unknown",
			sets: re.suggested_sets,
			reps: re.suggested_reps,
		}));

	return {
		id: template.id,
		name: template.name,
		description: template.description,
		muscles,
		exerciseCount: rels.length,
		exercises,
	};
};
