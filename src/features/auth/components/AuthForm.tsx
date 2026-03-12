"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";
import { Footer } from "@/components/ui/Footer";
import { useAuthForm } from "../_hooks/use-auth-form";
import { Checkbox } from "@/components/ui/checkbox";

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
	const { email, setEmail, password, setPassword, isLoading, errorMessage, handleAuth, handleForgotPassword, isAcceptedTOS, setIsAcceptedTOS } =
		useAuthForm(formMode);

	return (
		<div className="flex flex-col items-center justify-center min-h-[90vh] px-4 relative">
			<div className="w-full max-w-sm space-y-8">
				{/* Header Section: Logo, Title and Error Handling */}
				<header className="flex flex-col items-center">
					<Logo />
					<h2 className="mt-6 text-3xl font-extrabold tracking-tight">{formMode === "login" ? "Welcome back!" : "Join VOLT.LAB!"}</h2>
					{errorMessage && (
						<p className="mt-2 text-sm text-destructive font-bold bg-destructive/10 p-3 rounded-lg w-full text-center">{errorMessage}</p>
					)}
				</header>

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
								placeholder="••••••••"
								required
								className="h-12 bg-secondary/20"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>

						{/* PROTOCOL ACCEPTANCE BLOCK (Register Mode Only) */}
						{formMode === "register" && (
							<div className="flex items-start space-x-3 pt-2 bg-primary/5 p-4 rounded-lg border border-primary/10">
								<Checkbox id="tos" checked={isAcceptedTOS} onCheckedChange={(checked) => setIsAcceptedTOS(!!checked)} className="mt-1" required />
								<div className="grid gap-1.5 leading-none">
									<label htmlFor="tos" className="text-[11px] font-bold uppercase tracking-wider leading-tight cursor-pointer select-none">
										I accept the{" "}
										<Link href="/dashboard/privacy" className="text-primary underline underline-offset-4 hover:text-primary/80">
											Terms of Service
										</Link>
									</label>
									<p className="text-[9px] text-muted-foreground uppercase italic">Required.</p>
								</div>
							</div>
						)}
					</div>

					<Button
						type="submit"
						disabled={isLoading}
						className="w-full h-14 uppercase text-lg font-bold rounded-xl shadow-lg transition-all active:scale-[0.98]"
					>
						{isLoading ? "Loading..." : formMode === "login" ? "Log in" : "Create account"}
					</Button>
					<p className="flex items-center justify-center px-1">
						{/* FORGOT PASSWORD TRIGGER (Login Mode Only) */}
						{formMode === "login" && (
							<button
								type="button"
								onClick={handleForgotPassword}
								disabled={isLoading}
								className="text-[12px] font-bold uppercase tracking-widest text-primary hover:underline disabled:opacity-50"
							>
								Forgot password?
							</button>
						)}
					</p>
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
