/**
 * Represents a single exercise entity from the library.
 * This interface maps directly to the 'exercises' table in Supabase.
 */
export interface Exercise {
	id: string;
	name: string;
	muscle_group: string;
}

export interface ActiveSet {
	id: string;
	weight: number;
	reps: number;
	isCompleted: boolean;
}

export interface ActiveExercise {
	id: string; // Lokalny unikalny ID dla UI (randomUUID)
	exercise_id: string; // ID z bazy danych (do zapisu w historii)
	name: string;
	sets: ActiveSet[];
}
