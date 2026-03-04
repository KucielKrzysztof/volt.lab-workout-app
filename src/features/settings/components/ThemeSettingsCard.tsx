/**
 * @fileoverview Visual Mode Interactive Controller.
 * Implements a CSS-driven theme toggle to ensure zero-flicker SSR rendering.
 * @module features/settings/components
 */

"use client";

import { useSettings } from "../_hooks/use-settings";
import { Card } from "@/components/ui/card";
import { Moon, Sun } from "lucide-react";

/**
 * ThemeSettingsCard Component.
 * * @description
 * An interactive card that visualizes the current theme state. It utilizes the
 * "Isomorphic CSS Toggle" pattern, where both light and dark UI elements are
 * rendered simultaneously and visibility is controlled via Tailwind's dark-mode
 * variants.
 * * **Strategic Advantages:**
 * 1. **Hydration Mismatch Prevention**: By rendering both states and hiding one
 * via CSS, the server HTML always matches the client initial state.
 * 2. **Zero-Wait Interaction**: Does not require 'isMounted' flags; the UI is
 * visually correct and interactive from the first paint.
 * * **Logic Strategy:**
 * {HTML Class (.dark)} > {CSS Variant (dark:)} > {Display: block/hidden}
 * * @returns {JSX.Element} The high-contrast theme toggle card.
 */
export const ThemeSettingsCard = () => {
	/** * Hook Consumption:
	 * Accesses the 'toggleTheme' orchestrator which synchronizes state
	 * with server-side cookies.
	 */
	const { toggleTheme } = useSettings();

	return (
		<Card
			onClick={toggleTheme}
			className="group p-4 bg-secondary/5 border-white/5 hover:border-primary/30 cursor-pointer transition-all duration-300 active:scale-[0.98] flex items-center justify-between"
		>
			<div className="flex items-center gap-4 text-left">
				{/* ICON CONTAINER: 
                    Swaps Lucide icons using CSS selectors. 
                    Uses 'animate-in' for smooth visual entry.
                */}
				<div className="p-3 rounded-xl bg-secondary/20 group-hover:bg-primary/20 transition-colors">
					<Sun size={20} className="text-orange-500 block dark:hidden animate-in zoom-in duration-300" />
					<Moon size={20} className="text-primary hidden dark:block animate-in zoom-in duration-300" />
				</div>

				<div className="flex flex-col">
					{/* TEXT LABELS: 
                        Branded conceptual naming (Midnight vs Light) 
                        synchronized with the theme state.
                    */}
					<span className="font-black uppercase italic tracking-tighter text-lg leading-none dark:hidden">Light Mode</span>
					<span className="hidden dark:block font-black uppercase italic tracking-tighter text-lg leading-none">Midnight</span>

					<span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-60">Visual Atmosphere</span>
				</div>
			</div>

			<div className="text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Switch</div>
		</Card>
	);
};
