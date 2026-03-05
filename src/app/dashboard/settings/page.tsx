/**
 * @fileoverview Server-side Entry Point for Lab Settings.
 * Orchestrates the initial layout and semantic structure for the settings domain,
 * @module app/dashboard/settings
 */

import { PageHeader } from "@/components/ui/PageHeader";
import { SettingsClientView } from "@/features/settings/components/SettingsClientView";

export default async function SettingsPage() {
	return (
		<div className="p-4 md:p-10 max-w-4xl mx-auto space-y-10">
			<PageHeader title="Settings" subtitle="System Configuration & Preferences" />

			{/* INTERACTIVE ORCHESTRATOR: 
                Handles the stateful logic for settings (eg. themes)
                using the headless 'useSettings' hook.
            */}
			<SettingsClientView />
		</div>
	);
}
