/**
 * @fileoverview Settings Domain Client Orchestrator.
 * Aggregates configuration modules into a unified grid layout.
 * Optimized for SSR to ensure immediate visual stability and proper hydration.
 * @module features/settings/components/SettingsClientView
 */

"use client";

import { ThemeSettingsCard } from "./ThemeSettingsCard";
import { Card } from "@/components/ui/card";
import { useUser } from "@/core/providers/UserProvider";
import { DeleteAccountSection } from "@/features/auth/components/DeleteAccount";
import { Scale } from "lucide-react";
import { DataExportCard } from "./DataExportCard";

/**
 * SettingsClientView Component.
 * * @description
 * Acts as the primary orchestrator for the Settings domain. It coordinates
 * functional configuration modules and ensures that user-specific components
 * are only rendered once the identity context is fully resolved.
 * * **Core Responsibilities:**
 * 1. **Identity Resolution**: Consumes the global `UserProvider` context to retrieve the active session.
 * 2. **Hydration Guarding**: Implements a conditional render pattern to prevent flickering or
 * unauthorized rendering of destructive account actions during state resolution.
 * 3. **Layout Composition**: Organizes preference cards (Theme) and destructive
 * zones (Account Deletion) into a responsive grid.
 * * @returns {JSX.Element | null} The synchronized settings dashboard or null if the session is unresolved.
 */
export const SettingsClientView = () => {
	/** * Identity Context:
	 * Retrieves the active user session and loading state for hydration management.
	 */
	const { user, isLoading } = useUser();

	/** * Hydration & Authorization Guard:
	 * Ensures that the UI, specifically the sensitive 'DeleteAccountSection',
	 * is not rendered until the user UUID is securely verified in the client state.
	 */
	if (isLoading || !user) return null;

	return (
		<div className="grid gap-6 animate-in fade-in duration-500 delay-150">
			{/* SECTION: VISUAL EXPERIENCE */}
			<section className="space-y-3">
				<h3 className="text-xs font-black uppercase tracking-widest opacity-50 px-1">Appearance</h3>
				<ThemeSettingsCard />
			</section>

			{/* Placeholder */}
			<section className="space-y-3">
				<h3 className="text-xs font-black uppercase tracking-widest opacity-50 px-1">Training Units</h3>
				<Card className="p-4 bg-secondary/5 border-white/5 opacity-50 cursor-not-allowed flex justify-between items-center">
					<div className="flex items-center gap-3">
						<Scale size={18} className="text-muted-foreground" />
						<span className="font-bold uppercase italic text-sm tracking-tighter">Weight System: Metric (kg)</span>
					</div>
					<span className="text-[8px] font-black bg-secondary px-2 py-1 rounded italic uppercase">Coming Soon</span>
				</Card>
			</section>

			{/* DATA EXPORT */}
			<section className="space-y-3">
				<h3 className="text-xs font-black uppercase tracking-widest opacity-50 px-1">Data Export</h3>
				<DataExportCard userId={user.id} />
			</section>

			{/* ACCOUNT DELETION */}
			<section className="space-y-3">
				<DeleteAccountSection userId={user.id} />
			</section>
		</div>
	);
};
