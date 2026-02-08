import { Hero } from "@/features/landing/components/Hero";
import React from "react";

export default function Home(): React.JSX.Element {
	return (
		<div className="flex flex-col gap-6">
			<Hero />
		</div>
	);
}
