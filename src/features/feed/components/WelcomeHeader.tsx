"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/core/providers/UserProvider";
import { getDisplayName, getInitials } from "@/lib/helpers";

/**
 * User greeting component for the main feed.
 * Displays the user's name in a bold, underlined style alongside an Avatar.
 * Avatar includes a fallback mechanism using the user's initials.
 */
export const WelcomeHeader = () => {
	const { user, isLoading } = useUser();

	const displayName = getDisplayName(isLoading, user);
	const displayInitials = getInitials(isLoading, user);

	return (
		<div className="flex justify-between items-center py-6 gap-6 w-full">
			<div className="text-2xl font-black tracking-tight flex flex-col items-start gap-2 ">
				<p>WELCOME BACK,</p>
				<p className="text-primary underline decoration-2 underline-offset-4">{displayName}</p>
			</div>

			<Avatar className="h-12 w-12 sm:h-25 sm:w-25 border-2 border-primary/20 shadow-lg shadow-primary/10">
				<AvatarImage src="" /> {/* Later from Supabase */}
				<AvatarFallback className="bg-secondary text-primary font-bold sm:text-xl">{displayInitials}</AvatarFallback>
			</Avatar>
		</div>
	);
};
