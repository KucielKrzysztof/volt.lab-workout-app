import { Button } from "@/components/ui/button";

import React from "react";
import { Logo } from "./Logo";
import Link from "next/link";

export const Hero = (): React.JSX.Element => {
	return (
		<div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
			{/* LogoSection*/}
			<div className="mb-8 flex flex-col items-center">
				<Logo />
				<h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl">VOLT.LAB</h1>
				<p className="text-muted-foreground uppercase tracking-[0.2em] text-sm mt-2">build your power</p>
			</div>

			{/* Start */}
			<div className="w-full max-w-xs mt-10">
				<Link href="/login">
					<Button size="lg" className="w-full h-14 text-xl font-bold rounded-xl shadow-xl hover:scale-[1.02] transition-transform bg-primary">
						START
					</Button>
				</Link>
			</div>

			<footer className="absolute bottom-10 text-xs text-muted-foreground/50">Version 0.1 Alpha • Krzysztof Kuciel</footer>
		</div>
	);
};
