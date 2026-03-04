/**
 * @fileoverview User Identity and Performance Dashboard Orchestrator.
 * Acts as the top-level container for athlete profiles, coordinating identity sync,
 * yearly achievement tracking, and cross-component state management.
 * @module features/profile/components
 */

"use client";

import { useState } from "react";
import { useProfile } from "../_hooks/use-profile";
import { YearPicker } from "@/features/analytics/components/YearPicker";
import { RecordsSection } from "@/features/analytics/components/sections/RecordsSection";
import { RecordFormModal } from "@/features/analytics/components/RecordFormModal";
import { PersonalRecord, UserProfile } from "@/types/profile";
import { ErrorState } from "@/components/ui/ErrorState";
import { Button } from "@/components/ui/button";
import { ProfileHeader } from "./ProfileHeader";

interface ProfileClientViewProps {
	/** The unique UUID of the user from the Auth session. */
	userId: string;
	/** * Initial profile data fetched on the server to prevent layout shifts
	 * and provide instant content visibility.
	 */
	initialProfile: UserProfile;
}

/**
 * Main Client-Side Orchestrator for the User Profile section.
 * * @description
 * This component acts as the **Command Center** for athlete identity and achievements.
 * It bridges the gap between static server-side hydration and dynamic client-side
 * performance tracking, orchestrating the interaction between identity management
 * and record persistence.
 * * **Key Architectural Features:**
 * 1. **Decoupled Identity**: Delegates display name and avatar logic to the `ProfileHeader`,
 * keeping the orchestrator clean.
 * 2. **Temporal Slicing**: Integrates `YearPicker` to filter the "Hall of Fame"
 * by specific competition years.
 * 3. **Record Lifecycle**: Manages a unified modal for both creating and updating
 * yearly achievements using an "Upsert" strategy.
 * 4. **Identity Sync Bridge**: Coordinates display name updates with TanStack Query
 * and Supabase Auth session refreshing.
 * * @param {ProfileClientViewProps} props - Component properties.
 * @returns {JSX.Element} The orchestrated dashboard with identity and achievement layers.
 */
export const ProfileClientView = ({ userId, initialProfile }: ProfileClientViewProps) => {
	const [year, setYear] = useState(new Date().getFullYear());

	/** * Modal State Management:
	 * Handles the visibility and the specific data context for the RecordFormModal.
	 */
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingRecord, setEditingRecord] = useState<PersonalRecord | null>(null);

	/** * Central Logic Hook:
	 * Manages cache invalidation, background fetching, and the Auth session refresh
	 * cycle upon identity mutations.
	 */
	const { profile, updateProfile, addPersonalRecord, isUpdating, isError } = useProfile(userId, initialProfile);

	/** * Prepares and triggers the record management modal.
	 * @param {PersonalRecord} [record] - Optional record to populate the form for updates.
	 */
	const handleOpenModal = (record?: PersonalRecord) => {
		setEditingRecord(record || null);
		setIsModalOpen(true);
	};

	// Error boundary to prevent the app from breaking if a specific profile fails to load
	if (isError) {
		return <ErrorState title="Profile Loading Error" onRetry={() => window.location.reload()} />;
	}

	return (
		<div className="grid gap-8 animate-in fade-in duration-500">
			{/* IDENTITY LAYER: Encapsulates avatar uploads and inline display name editing */}
			<ProfileHeader userId={userId} profile={profile} onUpdateName={(name) => updateProfile({ display_name: name })} isLoading={isUpdating} />

			{/* Year navigation and record initiation trigger */}
			<div className="flex justify-center items-center px-1">
				<div className="flex flex-col gap-2">
					<YearPicker year={year} onYearChange={setYear} />
					<Button
						onClick={() => handleOpenModal()}
						className="bg-primary text-black w-full  font-black italic uppercase text-xs px-4 py-2 rounded-lg hover:scale-105 transition-transform"
					>
						+ Add Record
					</Button>
				</div>
			</div>

			{/* PERSONAL RECORDS SECTION
                Reuses the specialized RecordsSection from the Analytics feature to maintain UI consistency.
            */}
			<RecordsSection records={profile?.personal_records || []} year={year} onEdit={handleOpenModal} showTitle={true} />

			{/* MODAL FORM - Update Records(PR's)*/}
			<RecordFormModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={addPersonalRecord}
				initialData={editingRecord}
				isLoading={isUpdating}
			/>
		</div>
	);
};
