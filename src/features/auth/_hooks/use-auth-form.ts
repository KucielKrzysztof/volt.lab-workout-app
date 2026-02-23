import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/core/supabase/client";
import { toast } from "sonner";

/**
 * Custom hook to manage authentication logic for login and registration forms.
 * * @description
 * This hook encapsulates Supabase auth methods, local form state, and navigation logic.
 * It provides real-time feedback using the Sonner notification system.
 * * @param {"login" | "register"} formMode - Determines the authentication method and UI feedback.
 * * @returns {Object} State variables and the 'handleAuth' submission function.
 */
export const useAuthForm = (formMode: "login" | "register") => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const router = useRouter();
	const supabase = createClient();

	/**
	 * Handles the authentication submission process.
	 * * @description
	 * 1. **Login**: Authenticates via 'signInWithPassword'.
	 * 2. **Registration**: Creates a new user with metadata synchronized to the 'profiles' table.
	 * 3. **Feedback**: Displays success or error messages using Sonner toasts.
	 * * @param {React.FormEvent} e - The form submission event.
	 */
	const handleAuth = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setErrorMessage(null);

		try {
			if (formMode === "login") {
				// Attempt to sign in with email and password
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password,
				});
				if (error) throw error;
				// Success toast for login
				toast.success("Welcome back!", {
					description: "Redirecting to your dashboard...",
				});
			} else if (formMode === "register") {
				const generatedDisplayName = email.split("@")[0];

				// Attempt to register a new user
				const { error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						data: {
							full_name: generatedDisplayName,
						},
						// Redirect user back to the app after email confirmation if needed
						emailRedirectTo: `${window.location.origin}/auth/callback`,
					},
				});
				if (error) throw error;
				// Success toast for registration
				toast.success("Registration successful!", {
					description: "Please check your email to confirm your account.",
					duration: 10000,
				});
			}

			// If successful, redirect to the main feed
			router.push("/dashboard/feed");
			// Refresh to ensure proxy.ts catches the new session
			router.refresh();
		} catch (error: unknown) {
			let message = "Failed to perform authentication";
			if (error instanceof Error) {
				message = error.message;
			}
			setErrorMessage(message);
			// Display error toast
			toast.error("Authentication Error", {
				description: message,
			});
		} finally {
			setIsLoading(false);
		}
	};

	/**
	 * Handles the "Forgot Password" request.
	 * * @description
	 * Sends a password reset link to the user's email.
	 * The link redirects to /auth/reset-password upon clicking.
	 */
	const handleForgotPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) {
			toast.error("Email required", { description: "Please enter your email address first." });
			return;
		}
		setIsLoading(true);
		try {
			const { error } = await supabase.auth.resetPasswordForEmail(email, {
				// Redirects user to the password update form
				redirectTo: `${window.location.origin}/auth/reset-password`,
			});

			if (error) throw error;

			toast.success("Reset link sent!", {
				description: "Check your inbox for the password recovery email.",
				duration: 6000,
			});
		} catch (error: unknown) {
			let message = "Failed to perform authentication";
			if (error instanceof Error) {
				message = error.message;
			}
			toast.error("Error", { description: message || "Failed to send reset link" });
		} finally {
			setIsLoading(false);
		}
	};

	return {
		email,
		setEmail,
		password,
		setPassword,
		isLoading,
		errorMessage,
		handleAuth,
		handleForgotPassword,
	};
};
