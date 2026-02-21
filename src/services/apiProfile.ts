import { SupabaseClient } from "@supabase/supabase-js";
import { UserProfile, PersonalRecord } from "@/types/profile";

/**
 * Service responsible for all profile-related database and storage operations.
 * Acts as the bridge between the application UI and Supabase (Database + Storage).
 */
export const profileService = {
	/**
	 * Fetches a single public profile from the 'profiles' table.
	 * * @param {SupabaseClient} supabase - Authenticated Supabase client.
	 * @param {string} userId - The unique UUID of the user.
	 * @returns {Promise<UserProfile>} The user's profile data.
	 * @throws {Error} If the record is not found or database error occurs.
	 */
	async getProfile(supabase: SupabaseClient, userId: string): Promise<UserProfile> {
		const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();

		if (error) throw new Error(error.message);
		return data;
	},

	/**
	 * Updates specific fields in the user's public profile within the 'profiles' table.
	 * * @description
	 * This method performs a partial update (PATCH) on the profile record.
	 * You only need to provide the fields that should be changed.
	 * * @important
	 * Because of the PostgreSQL triggers we established, updating 'display_name'
	 * here will automatically trigger a synchronization with
	 * the 'auth.users' table metadata.
	 * * @example
	 * // Update only the display name
	 * await profileService.updateProfile(supabase, user.id, {
	 * display_name: "Giga Chad"
	 * });
	 * * // Update multiple fields including the JSONB records
	 * await profileService.updateProfile(supabase, user.id, {
	 * display_name: "Gym Beast",
	 * personal_records: [{ exercise_name: "Squat", weight: 200, date: "2026-02-21" }]
	 * });
	 * * @param {SupabaseClient} supabase - Authenticated Supabase client.
	 * @param {string} userId - The unique UUID of the user from auth.users.
	 * @param {Partial<UserProfile>} updates - An object where keys must match the 'profiles' table columns.
	 * Valid keys include: 'display_name', 'personal_records', 'updated_at'.
	 */
	async updateProfile(supabase: SupabaseClient, userId: string, updates: Partial<UserProfile>) {
		const { error } = await supabase.from("profiles").update(updates).eq("id", userId);

		if (error) throw new Error(error.message);
	},

	/**
	 * Orchestrates a multi-step process to change a user's avatar:
	 * 1. Generates a unique filename.
	 * 2. Uploads the file to the 'avatars' storage bucket.
	 * 3. Gets a permanent public link to that file.
	 * 4. Saves that link in the Database, which then (via SQL Trigger)
	 * updates Auth Metadata.
	 * * @param {SupabaseClient} supabase - Authenticated Supabase client.
	 * @param {string} userId - The unique UUID of the user.
	 * @param {File} file - The raw image file from the <input />.
	 * @returns {Promise<string>} The new public URL of the avatar.
	 */
	async uploadAvatar(supabase: SupabaseClient, userId: string, file: File) {
		// --- STEP 1: PREPARATION ---
		// We extract the extension (e.g., "png") to keep the original format.
		const fileExt = file.name.split(".").pop();

		// We create a unique filename. Why? To avoid caching issues or overwriting.
		// Format: [USER_ID]-[RANDOM_NUMBER].[EXTENSION]
		const fileName = `${userId}-${Math.random()}.${fileExt}`;
		const filePath = `avatars/${fileName}`;

		// --- STEP 2: PHYSICAL UPLOAD ---
		// We push the binary file to the 'avatars' bucket.
		// If the bucket doesn't exist or is private, this will throw an error.
		const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file);

		if (uploadError) throw new Error(uploadError.message);

		// --- STEP 3: LINK GENERATION ---
		// Now that the file is in the cloud, we need its "address".
		// getPublicUrl generates a permanent link to that specific file
		const {
			data: { publicUrl },
		} = supabase.storage.from("avatars").getPublicUrl(filePath);

		// --- STEP 4: DATABASE SYNCHRONIZATION ---
		// We call updateProfile to save the URL in the 'avatar_url' column.
		// REMEMBER: This triggers SQL function that updates 'auth.users'!
		await this.updateProfile(supabase, userId, { avatar_url: publicUrl });

		return publicUrl;
	},

	/**
	 * Manages Personal Records (PRs) within a JSONB array using an "Upsert" (Update or Insert) approach.
	 * * Since Supabase/PostgreSQL stores these as a JSON array in a single column,
	 * we handle the logic of finding, replacing, or adding new records locally
	 * before pushing the final state back to the server.
	 * * @param {SupabaseClient} supabase - Your authenticated Supabase lab assistant.
	 * @param {string} userId - The unique ID of the athlete.
	 * @param {PersonalRecord} newRecord - The new achievement (Name, Weight, Date).
	 */
	async addEditPersonalRecord(supabase: SupabaseClient, userId: string, newRecord: PersonalRecord) {
		// --- STEP 1: DOWNLOAD CURRENT STATE ---
		// Unlike standard SQL tables, to update a specific item inside a JSONB array
		// via the client SDK, we first need to know what's already there.
		const profile = await this.getProfile(supabase, userId);
		const existingRecords = profile.personal_records || [];

		// --- STEP 2: FIND THE TARGET ---
		// We check if this exercise (e.g., 'Bench Press') already has a record.
		// We use .toLowerCase() so that 'SQUAT' and 'squat' are treated as the same thing.
		const recordIndex = existingRecords.findIndex((r) => r.exercise_name.toLowerCase() === newRecord.exercise_name.toLowerCase());

		let updatedRecords;

		// --- STEP 3: APPLY LOGIC (Overwrite vs Append) ---
		if (recordIndex !== -1) {
			// SCENARIO: EDIT
			// If the record exists, we create a shallow copy of the array and
			// swap the old record with the new one at the exact same position.
			updatedRecords = [...existingRecords];
			updatedRecords[recordIndex] = newRecord;
		} else {
			// SCENARIO: ADD
			// If it's a new exercise, we just append it to the end of the list.
			updatedRecords = [...existingRecords, newRecord];
		}

		// --- STEP 4: PUSH UPDATED BUNDLE ---
		// We send the entire updated array back to the 'personal_records' column.
		// We also update 'updated_at' so we know exactly when the lab records changed.
		const { error } = await supabase
			.from("profiles")
			.update({
				personal_records: updatedRecords,
				updated_at: new Date().toISOString(),
			})
			.eq("id", userId);

		if (error) throw new Error(error.message);
	},
};
