import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/core/supabase/client";
import { profileService } from "@/services/apiProfile";
import { PersonalRecord, UserProfile } from "@/types/profile";
import { toast } from "sonner";

/**
 * Comprehensive hook for managing user profile data, avatars, and personal records.
 * * This hook handles:
 * 1. **Data Hydration**: Supports SSR data through `initialProfile`.
 * 2. **Auth Synchronization**: Automatically refreshes Supabase sessions to sync JWT metadata with DB changes.
 * 3. **Yearly PR Strategy**: Manages the persistence of Personal Records on a per-year basis.
 * * @param {string | undefined} userId - The unique identifier of the authenticated user.
 * @param {UserProfile | null} [initialProfile] - Optional server-side fetched profile for instant hydration.
 * * @returns {Object} An object containing profile data, loading states, and mutation functions.
 */
export const useProfile = (userId: string | undefined, initialProfile?: UserProfile | null) => {
	const supabase = createClient();
	const queryClient = useQueryClient();

	/**
	 * Internal helper to force a session refresh.
	 * Required to synchronize the client-side 'auth.user' metadata after database triggers update the 'auth.users' table.
	 */
	const refreshAuth = async () => {
		const { data, error } = await supabase.auth.refreshSession();
		if (error) console.error("Session refresh error:", error.message);
		return data;
	};

	/**
	 * Fetches the public profile data from the 'profiles' table.
	 * Enabled only if a valid userId is provided.
	 */
	const profileQuery = useQuery({
		queryKey: ["profile", userId],
		queryFn: () => profileService.getProfile(supabase, userId!),
		enabled: !!userId,
		initialData: initialProfile || undefined, // Hydration from SSR
	});

	/**
	 * Mutation to update profile identity (e.g., display_name).
	 * Triggers a session refresh to update the global auth context.
	 */
	const updateProfileMutation = useMutation({
		mutationFn: (updates: Partial<UserProfile>) => profileService.updateProfile(supabase, userId!, updates),
		onSuccess: async () => {
			await refreshAuth();
			queryClient.invalidateQueries({ queryKey: ["profile", userId] });
			toast.success("Profile updated!");
		},
	});

	/**
	 * Mutation to handle file upload and avatar URL update.
	 * Uploads file to Supabase Storage and syncs the new URL to both Profiles and Auth metadata.
	 */
	const uploadAvatarMutation = useMutation({
		mutationFn: (file: File) => profileService.uploadAvatar(supabase, userId!, file),
		onSuccess: async () => {
			await refreshAuth();
			queryClient.invalidateQueries({ queryKey: ["profile", userId] });
			toast.success("Avatar updated!", {
				style: { background: "var(--primary)", color: "black" },
			});
		},
		onError: () => toast.error("Upload failed. Check bucket permissions."),
	});

	/**
	 * Mutation to manage Yearly Personal Records (PRs) stored in a JSONB array.
	 * * @description
	 * Implements a yearly upsert:
	 * - If (Exercise + Year) exists -> Overwrite.
	 * - If (Exercise + Year) is new -> Append.
	 */
	const addPRMutation = useMutation({
		mutationFn: (newRecord: PersonalRecord) => profileService.addEditPersonalRecord(supabase, userId!, newRecord),
		onSuccess: async () => {
			// Refreshing profile ensures the UI reflects changes in the JSONB structure
			await refreshAuth();
			queryClient.invalidateQueries({ queryKey: ["profile", userId] });
			toast.success("Record updated!");
		},
		onError: (error) => {
			toast.error("Update failed: " + error.message);
		},
	});

	return {
		/** The current user profile data */
		profile: profileQuery.data,
		/** Boolean flag indicating the initial profile fetch status */
		isLoading: profileQuery.isLoading,
		/** Boolean flag indicating if the profile fetch failed */
		isError: profileQuery.isError,
		/** Triggers display name and profile updates */
		updateProfile: updateProfileMutation.mutate,
		/** Triggers the avatar upload process */
		uploadAvatar: uploadAvatarMutation.mutate,
		/** Triggers the PR upsert logic in JSONB */
		addPersonalRecord: addPRMutation.mutate,
		/** Combined loading state for all background update operations */
		isUpdating: updateProfileMutation.isPending || uploadAvatarMutation.isPending || addPRMutation.isPending,
	};
};
