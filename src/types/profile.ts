export interface PersonalRecord {
	exercise_name: string;
	weight: number;
	date: string;
	reps?: number;
}

export interface UserProfile {
	id: string;
	display_name: string | null;
	avatar_url: string | null;
	personal_records: PersonalRecord[];
	updated_at: string;
}
