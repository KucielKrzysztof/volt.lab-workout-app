/**
 * @fileoverview Server-side Entry Point for Lab Settings.
 * Orchestrates the initial layout and semantic structure for the settings domain,
 * @module app/dashboard/settings
 */

import { SettingsClientView } from "@/features/settings/components/SettingsClientView";

export default async function SettingsPage() {
	return (
		<div className="p-4 md:p-10 max-w-4xl mx-auto space-y-10">
			<header className="mx-auto text-center">
				<h1 className="text-2xl font-black tracking-tighter italic uppercase">Settings</h1>
				<p className="text-[10px] text-muted-foreground uppercase tracking-widest text-center">System Configuration & Preferences</p>
			</header>

			{/* INTERACTIVE ORCHESTRATOR: 
                Handles the stateful logic for settings (eg. themes)
                using the headless 'useSettings' hook.
            */}
			<SettingsClientView />
		</div>
	);
}
