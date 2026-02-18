import React from "react";
import { Logo } from "./Logo";

export const Hero = (): React.JSX.Element => {
	return (
		<>
			<div className="mb-8 flex flex-col items-center">
				<Logo />
				<h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl">VOLT.LAB</h1>
				<p className="text-muted-foreground uppercase tracking-[0.2em] text-sm mt-2">build your power</p>
			</div>
		</>
	);
};
