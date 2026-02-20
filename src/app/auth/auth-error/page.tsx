"use client";

import { useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Technical error page for Authentication failures.
 * Captures the 'error' query parameter from the callback route.
 */
export default function AuthErrorPage() {
	const searchParams = useSearchParams();
	const error = searchParams.get("error") || "An unknown authentication error occurred.";

	return (
		<div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
			<div className="w-full max-w-sm space-y-6">
				<div className="flex flex-col items-center gap-4">
					<div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
						<AlertCircle className="h-10 w-10 text-destructive" />
					</div>
					<h1 className="text-3xl font-black italic tracking-tighter uppercase">
						Auth <span className="text-destructive">Failure</span>
					</h1>
				</div>

				<div className="bg-secondary/20 border border-destructive/20 p-6 rounded-xl">
					<p className="text-xs text-muted-foreground uppercase tracking-widest mb-2 font-bold">Error Message:</p>
					<p className="text-sm font-mono text-foreground break-words">{error}</p>
				</div>

				<div className="space-y-3">
					<Button asChild className="w-full h-12 uppercase font-bold" variant="outline">
						<Link href="/auth/login">
							<ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
						</Link>
					</Button>
					<p className="text-[10px] text-muted-foreground uppercase">Tip: Check if your activation link has not expired.</p>
				</div>
			</div>
		</div>
	);
}
