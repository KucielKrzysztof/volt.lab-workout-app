import { Footer } from "@/components/ui/Footer";
import { Hero } from "@/components/ui/Hero";
import { StartButton } from "@/components/ui/StartButton";

/**
 * Application Landing Page (Index).
 * Serving as the public entry point for the VOLT.LAB application.
 * - Public Access: This page is typically accessible without authentication.
 */
export default function Home(): React.JSX.Element {
	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
				<Hero />
				<StartButton />
				<Footer />
			</div>
		</div>
	);
}
