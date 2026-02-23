"use client";

import { createClient } from "@/core/supabase/client";
import { useRouter } from "next/navigation";

import { useState } from "react";
import { toast } from "sonner";

/**
 * Hook to manage the actual password update process.
 * * @description
 * Uses 'updateUser' to set a new password for the currently authenticated recovery session.
 */
export const useResetPassword = () => {
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const supabase = createClient();
	const router = useRouter();

	const handleReset = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			// Updates the user's password in the auth metadata
			const { error } = await supabase.auth.updateUser({ password });
			if (error) throw error;

			toast.success("Password updated!", {
				description: "You can now log in with your new password.",
			});
			router.push("/auth/login");
		} catch (error: unknown) {
			let message = "Reset failed";
			if (error instanceof Error) {
				message = error.message;
			}
			toast.error("Error", { description: message || "Failed to reset password" });
		} finally {
			setIsLoading(false);
		}
	};
	return { password, setPassword, isLoading, handleReset };
};
