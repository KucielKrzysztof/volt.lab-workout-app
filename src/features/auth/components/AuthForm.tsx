"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";
import { Footer } from "@/components/ui/Footer";
// import { supabase } from "@/core/supabase/client";

interface AuthFormProps {
	formMode: "login" | "register";
}

export const AuthForm = ({ formMode }: AuthFormProps) => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter();

	const handleAuth = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// const { error } =
		// 	mode === "login" ? await supabase.auth.signInWithPassword({ email, password }) : await supabase.auth.signUp({ email, password });

		// if (error) {
		// 	alert(error.message);
		// } else {
		// 	router.push("/feed");
		// }
		// setLoading(false);
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-[90vh] px-4 relative">
			<div className="w-full max-w-sm space-y-8">
				<div className="flex flex-col items-center">
					<Logo />
					<h2 className="mt-6 text-3xl font-extrabold tracking-tight">{formMode === "login" ? "Welcome back!" : "Join VOLT.LAB!"}</h2>
					<p className="text-muted-foreground text-sm mt-2">
						{formMode === "login" ? "Enter your credentials" : "Start building your strength today!"}
					</p>
				</div>
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

				<p className="text-center text-sm text-muted-foreground">
					{formMode === "login" ? (
						<>
							Dont have an account?{" "}
							<Link href="/register" className="text-primary font-bold hover:underline">
								Register
							</Link>
						</>
					) : (
						<>
							Already a user?{" "}
							<Link href="/login" className="text-primary font-bold hover:underline">
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
