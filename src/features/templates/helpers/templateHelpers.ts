import { WorkoutTemplateJoined, WorkoutTemplateUI } from "@/types/templates";

/**
 * Maps a joined database template to a flat UI-friendly object.
 * Extracts unique muscle groups and creates a name preview.
 */
export const mapTemplateForUI = (template: WorkoutTemplateJoined): WorkoutTemplateUI => {
	const rels = template.template_exercises || [];

	// Extract unique muscle groups from the joined exercise metadata.
	const muscles = [...new Set(rels.map((re) => re.exercises?.muscle_group).filter(Boolean))] as string[];

	/** * Comprehensive Exercise Mapping:
	 * Pulls every exercise name and its suggested volume (sets/reps).
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
