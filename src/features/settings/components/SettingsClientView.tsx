/**
 * @fileoverview Settings Domain Client Orchestrator.
 * Aggregates configuration modules into a unified grid layout.
 * Optimized for SSR to ensure immediate visual stability.
 * @module features/settings/components
 */

"use client";

import { ThemeSettingsCard } from "./ThemeSettingsCard";
import { Card } from "@/components/ui/card";
import { Scale } from "lucide-react";

/**
 * SettingsClientView Component.
 * * @description
 * Acts as the primary manager for the Settings domain. It organizes functional
 * components (like theme toggles) and roadmap placeholders into semantic sections.
 * * @returns {JSX.Element} The orchestrated settings dashboard.
 */
export const SettingsClientView = () => {
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
		</div>
	);
};
