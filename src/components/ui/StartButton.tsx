import Link from "next/link";
import { Button } from "@/components/ui/button";

export const StartButton = () => {
	return (
		<div className="w-full max-w-xs mt-10">
			<Link href="/auth/login">
				<Button size="lg" className="w-full h-14 text-xl font-bold rounded-xl shadow-xl hover:scale-[1.02] transition-transform bg-primary">
					START
				</Button>
			</Link>
		</div>
	);
};
