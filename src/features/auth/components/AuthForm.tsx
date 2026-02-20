"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";
import { Footer } from "@/components/ui/Footer";
import { useAuthForm } from "../_hooks/use-auth-form";

interface AuthFormProps {
	/** Determines if the form should handle user login or new account registration. */
	formMode: "login" | "register";
}

/**
 * AuthForm Presentational Component.
 * It dynamically renders text and labels based on the `formMode` prop.
 * * @design_pattern Container-Presenter (via custom hook).
 * @logic_source {@link useAuthForm} - All business logic and Supabase calls are decoupled here.
 * * @param {AuthFormProps} props - The properties for the authentication form.
 * @returns {JSX.Element} A fully styled, responsive auth interface.
 */
export const AuthForm = ({ formMode }: AuthFormProps) => {
	// Business logic extracted to custom hook for clean SoC (Separation of Concerns)
	const { email, setEmail, password, setPassword, isLoading, errorMessage, handleAuth } = useAuthForm(formMode);

	return (
		<div className="flex flex-col items-center justify-center min-h-[90vh] px-4 relative">
			<div className="w-full max-w-sm space-y-8">
				{/* Header Section: Logo, Title and Error Handling */}
				<div className="flex flex-col items-center">
					<Logo />
					<h2 className="mt-6 text-3xl font-extrabold tracking-tight">{formMode === "login" ? "Welcome back!" : "Join VOLT.LAB!"}</h2>
					{errorMessage && (
						<p className="mt-2 text-sm text-destructive font-bold bg-destructive/10 p-3 rounded-lg w-full text-center">{errorMessage}</p>
					)}
				</div>

				{/* Interaction Section: Email/Password inputs and submission */}
				<form onSubmit={handleAuth} className="mt-8 space-y-6">
					<div className="space-y-4">
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="dziku@siownia.pl"
								required
								className="h-12 bg-secondary/20"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								required
								className="h-12 bg-secondary/20"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
					</div>

					<Button
						type="submit"
						disabled={isLoading}
						className="w-full h-14 uppercase text-lg font-bold rounded-xl shadow-lg transition-all active:scale-[0.98]"
					>
						{isLoading ? "Loading..." : formMode === "login" ? "Log in" : "Create account"}
					</Button>
				</form>

				{/* Footer Section: Dynamic navigation link between auth modes */}
				<p className="text-center text-sm text-muted-foreground">
					{formMode === "login" ? (
						<>
							Dont have an account?{" "}
							<Link href="/auth/register" className="text-primary font-bold hover:underline">
								Register
							</Link>
						</>
					) : (
						<>
							Already a user?{" "}
							<Link href="/auth/login" className="text-primary font-bold hover:underline">
								Login
							</Link>
						</>
					)}
				</p>
			</div>
			<Footer />
		</div>
	);
};
