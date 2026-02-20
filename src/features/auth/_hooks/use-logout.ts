import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/core/supabase/client";

/**
 * Custom hook to handle the user logout process.
 * Interacts with Supabase auth and handles navigation after sign-out.
 */
export const useLogout = () => {
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const router = useRouter();
	const supabase = createClient();

	const logout = async () => {
		try {
			setIsLoggingOut(true);

			// 1. Sign out from Supabase (clears session and cookies)
			const { error } = await supabase.auth.signOut();

			if (error) throw error;

			// 2. Redirect to login and refresh to clear any cached user state
			router.push("/auth/login");
			router.refresh();
		} catch (error) {
			console.error("Logout failed:", error);
			alert("Failed to log out. Please try again.");
		} finally {
			setIsLoggingOut(false);
		}
	};

	return { logout, isLoggingOut };
};
