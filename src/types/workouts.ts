/**
 * Represents a completed workout session.
 * NOTE: This is a temporary structure used for UI prototyping and Mock data.
 * It will be refined once the persistent workout history is implemented in Supabase.
 */
export interface Workout {
	id: string;
	title: string;
	date: string;
	duration: number;
	volume: string;
	exercises: string[];
	muscles: string[];
}
