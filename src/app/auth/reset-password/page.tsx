"use client";

import { useResetPassword } from "@/features/auth/_hooks/use-reset-password";
import { Card } from "@/components/ui/card";
import { Loader2, Lock } from "lucide-react";
import { Footer } from "@/components/ui/Footer";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";

/**
 * Reset Password Page Component.
 * * @description
 * This page is accessed via a secure link sent to the user's email.
 * It allows the user to set a new password for their account.
 */
export default function ResetPasswordPage() {
	// Custom hook to manage the update logic and loading states
	const { password, setPassword, isLoading, handleReset } = useResetPassword();

	return (
		<div className="min-h-screen flex items-center justify-center p-6 bg-background">
			<div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
				{/* BRAND LOGO / HEADER */}
				<header className="flex flex-col items-center mb-8">
					<Logo />
					<h2 className=" text-center text-primary text-xl uppercase mt-4 font-extrabold tracking-tight">Enter a strong new password.</h2>
				</header>

				{/* RESET FORM CARD */}
				<Card className="p-8 bg-secondary/5 border-white/5 shadow-2xl">
					<form onSubmit={handleReset} className="space-y-6">
						<div className="space-y-2">
							<label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
								New Password
							</label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<input
									id="password"
									type="password"
									required
									placeholder="••••••••"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									disabled={isLoading}
									className="w-full bg-secondary/20 border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all disabled:opacity-50"
								/>
							</div>
						</div>

						{/* SUBMIT BUTTON */}
						<Button
							type="submit"
							disabled={isLoading || password.length < 6}
							// " uppercase rounded-xl shadow-lg transition-all active:scale-[0.98]"
							className="w-full h-14 bg-primary text-primary-foreground font-bold  uppercase py-3 rounded-lg tracking-tighter hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-primary/10"
						>
							{isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Update Password"}
						</Button>
					</form>
				</Card>

				{/* FOOTER HINT */}
				<Footer />
			</div>
		</div>
	);
}
