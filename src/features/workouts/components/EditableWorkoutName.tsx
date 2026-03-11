/**
 * @fileoverview Inline editor for the active workout session name.
 * Features a seamless transition between display and edit modes with
 * automatic focus and state persistence.
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { useActiveWorkoutStore } from "../_hooks/use-active-workout-store";
import { Input } from "@/components/ui/input";
import { Pencil, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * EditableWorkoutName Component.
 * * @description
 * Provides a "Click-to-Edit" interface for the current workout protocol.
 * * **Logic Flow:**
 * 1. Displays the current name from Zustand store.
 * 2. On click, switches to an input field with auto-focus/select.
 * 3. On Enter or Blur, sanitizes input via `.trim()` and updates the global store.
 * 4. On Escape, reverts to the previous state.
 * * @returns {JSX.Element} An interactive heading for the active session.
 */
export const EditableWorkoutName = () => {
	/** * Extract session identity and the update action from the global store.
	 */
	const { name, updateName } = useActiveWorkoutStore();

	/** * Local state for managing UI mode and transient string values
	 * before they are committed to the store.
	 */
	const [isEditing, setIsEditing] = useState(false);
	const [tempName, setTempName] = useState(name);
	const inputRef = useRef<HTMLInputElement>(null);

	/** * Ensure local state stays in sync with the store during
	 * hydration or initial session initiation.
	 */
	useEffect(() => {
		setTempName(name);
	}, [name]);

	/** * Triggers auto-focus and text selection when entering edit mode
	 * to streamline user interaction.
	 */
	useEffect(() => {
		if (isEditing) {
			inputRef.current?.focus();
			inputRef.current?.select();
		}
	}, [isEditing]);

	/** * Sanitizes the transient input and commits changes to the global store.
	 * Reverts to the previous valid state if the input is null or whitespace.
	 */
	const handleSave = () => {
		const trimmedName = tempName.trim();
		if (trimmedName && trimmedName !== name) {
			updateName(trimmedName);
		} else {
			setTempName(name);
		}
		setIsEditing(false);
	};

	/** * Keyboard event orchestration for rapid data entry.
	 * @param {React.KeyboardEvent} e - The browser keyboard event.
	 */
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") handleSave();
		if (e.key === "Escape") {
			setTempName(name);
			setIsEditing(false);
		}
	};

	// --- RENDER: EDIT MODE ---
	if (isEditing) {
		return (
			<div className="flex items-center gap-2 w-full max-w-xs animate-in fade-in zoom-in-95 duration-200">
				<Input
					ref={inputRef}
					value={tempName}
					onChange={(e) => setTempName(e.target.value)}
					onKeyDown={handleKeyDown}
					className="bg-background border-primary/40 text-xl font-black italic uppercase tracking-tighter text-center h-10"
					placeholder="Enter Protocol Name..."
				/>
				<button onClick={handleSave} className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors">
					<Check size={18} />
				</button>
			</div>
		);
	}

	// --- RENDER: DISPLAY MODE ---
	return (
		<div onClick={() => setIsEditing(true)} className="group flex flex-col items-center cursor-pointer py-1">
			<div className="flex items-center gap-3 transition-all duration-300 group-hover:scale-[1.02]">
				<h1
					className={cn(
						"text-2xl font-black italic uppercase tracking-tighter transition-colors tabular-nums",
						name === "QUICK START SESSION" ? "text-muted-foreground/60" : "text-foreground",
					)}
				>
					{name || "UNNAMED PROTOCOL"}
				</h1>
				<Pencil
					size={16}
					className="text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0"
				/>
			</div>

			{/* Visual hint for non-template workouts */}
			{name === "QUICK START SESSION" && (
				<span className="text-[8px] font-bold tracking-[0.2em] text-primary/40 uppercase mt-1  group-hover:opacity-90 transition-opacity">
					Click to Rename Protocol
				</span>
			)}
		</div>
	);
};
