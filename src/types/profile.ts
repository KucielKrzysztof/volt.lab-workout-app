/**
 * @fileoverview Identity and Achievement Type System.
 * Defines the user profile structure and the JSONB-stored personal records,
 * serving as the primary source of truth for user metadata and peak performance.
 * @module types/profile
 */

/**
 * Represents a historical peak performance milestone (Personal Record).
 * * @description
 * These entities are stored as a JSONB array within the `UserProfile`.
 * This allows for a schema-less approach to achievements, where new
 * metrics (like reps) can be optionally included without database migrations.
 * @interface PersonalRecord
 * @property {string} exercise_name - The canonical name of the exercise (e.g., "Deadlift").
 * @property {number} weight - The maximum load successfully lifted in kilograms (kg).
 * @property {string} date - ISO timestamp of when the record was achieved.
 * @property {number} [reps] - Optional rep count.
 */
export interface PersonalRecord {
	exercise_name: string;
	weight: number;
	date: string;
	reps?: number;
}

/**
 * The augmented user profile entity.
 * * @description
 * This interface represents the combined data from `auth.users` and the
 * `public.profiles` table. It is synchronized via PostgreSQL triggers
 * to ensure that identity metadata is always up to date.
 * * **Key Features:**
 * 1. **Identity Hub**: Centralizes display names and avatar references.
 * 2. **Achievement Storage**: Holds the `personal_records` array, enabling
 * "one-query" hydration of the entire user dashboard.
 * 3. **Sync Tracking**: Uses `updated_at` to manage cache invalidation in TanStack Query.
 * @interface UserProfile
 * @property {string} id - UUID primary key linked directly to Supabase Auth.
 * @property {string | null} display_name - User-defined nickname or full name.
 * @property {string | null} avatar_url - Public CDN link to the profile image stored in Supabase Storage.
 * @property {PersonalRecord[]} personal_records - The collection of user achievements (JSONB-backed).
 * @property {string} updated_at - ISO timestamp of the last profile modification.
 */
export interface UserProfile {
	id: string;
	display_name: string | null;
	avatar_url: string | null;
	personal_records: PersonalRecord[];
	updated_at: string;
}
