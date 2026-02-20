/**
 * Custom hook to manage authentication logic.
 * Encapsulates Supabase auth methods, form state, and navigation.
 * * @param formMode - Determines whether the form acts as a 'login' or 'register' interface.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/core/supabase/client";

export const useAuthForm = (formMode: "login" | "register") => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const router = useRouter();
	const supabase = createClient();

	/**
	 * Handles the authentication submission.
	 * To be integrated with Supabase auth methods:
	 * - mode === 'login' -> signInWithPassword()
	 * - mode === 'register' -> signUp()
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
				alert("Registration successful! Please check your email for confirmation.");
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
	};
};
