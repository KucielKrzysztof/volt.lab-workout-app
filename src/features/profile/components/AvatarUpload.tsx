"use client";

import { useProfile } from "../_hooks/use-profile";
import { Camera, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvatarUploadProps {
	userId: string;
}

/**
 * AvatarUpload Component
 * * @description
 * A specialized UI component for managing user profile imagery. It provides a visual
 * representation of the user (either an image or initials fallback) and handles the
 * interface for selecting and uploading new files.
 * * @features
 * - **Real-time Feedback**: Displays a loading spinner and dims the image during the upload process.
 * - **Smart Fallback**: Automatically generates initials from the user's display name if no avatar exists.
 * - **Seamless Integration**: Directly triggers the `uploadAvatar` mutation from the `useProfile` hook.
 * - **Visual Polish**: Includes hover states and transitions consistent with the VOLT.LAB design system.
 */
export const AvatarUpload = ({ userId }: AvatarUploadProps) => {
	// Accessing profile data and upload mutations via the centralized profile hook
	const { profile, uploadAvatar, isUpdating } = useProfile(userId);

	/**
	 * Handles the selection of a file from the user's device.
	 * Extracts the first file from the input and triggers the upload mutation.
	 * * @param {React.ChangeEvent<HTMLInputElement>} e - The standard change event from a file input.
	 */
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) uploadAvatar(file);
	};
	return (
		<div className="relative group">
			{/* MAIN AVATAR COMPONENT 
                We use the large size (h-32) to match your previous design.
                The 'group-hover' logic is applied directly to the Avatar border.
            */}
			<Avatar
				className={cn("h-32 w-32 border-4 border-secondary transition-all group-hover:border-primary/50 shadow-xl", isUpdating && "opacity-50")}
			>
				{/* AvatarImage: Handles the actual profile picture.
                    The 'object-cover' ensures the photo doesn't stretch.
                */}
				<AvatarImage src={profile?.avatar_url || ""} alt={profile?.display_name || "User"} className="object-cover" />

				{/* AvatarFallback: Rendered if the image is missing or failing to load.
                    Uses your brand's secondary colors.
                */}
				<AvatarFallback className="bg-secondary text-primary font-black text-2xl uppercase">
					{profile?.display_name?.substring(0, 2) || "??"}
				</AvatarFallback>

				{/* LOADING OVERLAY
                    Positioned absolutely inside the Avatar circle.
                */}
				{isUpdating && (
					<div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
						<Loader2 className="h-8 w-8 animate-spin text-primary" />
					</div>
				)}
			</Avatar>

			{/* UPLOAD TRIGGER (Floating Camera Button) */}
			<label
				className={cn(
					"absolute bottom-0 right-0 p-2 rounded-full bg-primary text-black cursor-pointer shadow-2xl hover:scale-110 transition-transform active:scale-95 z-10",
					isUpdating && "pointer-events-none opacity-50",
				)}
			>
				<Camera className="h-5 w-5" />
				<input type="file" className="hidden" onChange={handleFileChange} accept="image/*" disabled={isUpdating} />
			</label>
		</div>
	);
};
