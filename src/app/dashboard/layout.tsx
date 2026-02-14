import { BottomNav } from "@/features/navigation/components/BottomNav";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col">
			<main className="flex-1  mx-auto p-4 pb-24">{children}</main>
			<BottomNav />
		</div>
	);
}
