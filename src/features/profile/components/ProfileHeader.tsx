/**
 * @fileoverview Athlete Identity Header Component.
 * Encapsulates avatar management and a highly-optimized inline editing
 * interface for the user's display name.
 * @module features/profile/components
 */

"use client";

import { useState } from "react";
import { Check, Edit2, X } from "lucide-react";
import { AvatarUpload } from "./AvatarUpload";
import { Card } from "@/components/ui/card";
import { UserProfile } from "@/types/profile";

interface ProfileHeaderProps {
	userId: string;
	profile: UserProfile | null | undefined; /** The hydrated profile data object from the server or client cache. */
	onUpdateName: (newName: string) => void; /** Callback function to trigger the profile update mutation. */
	isLoading?: boolean; /** Global loading state indicator from the parent orchestrator. */
}

/**
 * Atomic Identity sub-component.
 * * @description
 * This component follows the **"On-Demand Initialization"** pattern. It avoids
 * problematic `useEffect` synchronization by initializing local state only
 * when interaction occurs.
 * * **Key UX Features:**
 * 1. **Inline Persistence**: Seamlessly switches between display and edit modes
 * within a high-contrast shadow card.
 * 2. **State Reset via Key**: Implements a robust "Key Reset" strategy. If the
 * global profile data changes, the entire component (and its internal state)
 * is reset by React to ensure data integrity.
 * 3. **Input Affordance**: Uses Lucide icons and Tailwind animations to guide
 * the user through the identity update lifecycle.
 * * @param {ProfileHeaderProps} props - Component properties.
 * @returns {JSX.Element} The rendered athlete identity card.
 */
export const ProfileHeader = ({ userId, profile, onUpdateName, isLoading }: ProfileHeaderProps) => {
	/** * Interaction State:
	 * Manages the toggling between the h2 title and the stylized input field.
	 */
	const [isEditing, setIsEditing] = useState(false);
	/** * Ephemeral Input State:
	 * Holds the temporary username value during the editing process.
	 */
	const [newName, setNewName] = useState("");

	/** * Manual Initialization:
	 * Triggered by user intent (click). This avoids the "Cascading Renders"
	 * anti-pattern associated with useEffect.
	 */
	const handleStartEdit = () => {
		setNewName(profile?.display_name || "");
		setIsEditing(true);
	};

	/** * Persistence Logic:
	 * Dispatches the update only if the value is non-empty and has actually changed.
	 */
	const handleSave = () => {
		if (newName.trim() && newName !== profile?.display_name) {
			onUpdateName(newName);
		}
		setIsEditing(false);
	};

	/** * Reversion Logic:
	 * Resets the local state to the original display name from props.
	 */
	const handleCancel = () => {
		setNewName(profile?.display_name || "");
		setIsEditing(false);
	};

	return (
		/**
		 * Pattern: State Reset via Key.
		 * By using the display_name, React will automatically
		 * reset the component's internal state if the server data changes significantly.
		 */
		<Card key={profile?.display_name} className="p-6 bg-secondary/5 border-white/5 flex flex-col md:flex-row items-center gap-8 shadow-xl">
			{/* AVATAR LAYER: Direct interaction with Storage & Auth Meta */}
			<AvatarUpload userId={userId} />

			<div className="text-center md:text-left space-y-1 group flex-1">
				{isEditing ? (
					/* EDITING INTERFACE: High-legibility input with action triggers */
					<div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
						<input
							autoFocus
							disabled={isLoading}
							value={newName}
							onChange={(e) => setNewName(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleSave()}
							onKeyDownCapture={(e) => e.key === "Escape" && handleCancel()}
							className="bg-secondary/20 border-b-2 border-primary outline-none text-2xl font-black uppercase italic tracking-tighter px-2 py-1 w-full max-w-[300px] disabled:opacity-50"
						/>
						<div className="flex gap-1">
							<button onClick={handleSave} className="text-primary hover:scale-110 transition-transform">
								<Check size={20} />
							</button>
							<button onClick={handleCancel} className="text-destructive hover:scale-110 transition-transform">
								<X size={20} />
							</button>
						</div>
					</div>
				) : (
					/* DISPLAY INTERFACE: Branded presentation of the athlete's name */
					<div className="flex items-center justify-center md:justify-start gap-3 cursor-pointer group" onClick={handleStartEdit}>
						<h2 className="text-3xl font-black uppercase italic tracking-tighter hover:text-primary transition-colors">
							{profile?.display_name || "Anon"}
						</h2>
						<Edit2 size={16} className="opacity-0 group-hover:opacity-40 transition-opacity" />
					</div>
				)}
				<p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Member</p>
			</div>
		</Card>
	);
};
