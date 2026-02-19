/**
 * Represents a single exercise entity from the library.
 * This interface maps directly to the 'exercises' table in Supabase.
 */
export interface Exercise {
	id: string;
	name: string;
	muscle_group: string;
}
