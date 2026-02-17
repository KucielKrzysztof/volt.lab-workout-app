import { Footer } from "@/features/landing/components/Footer";
import { Hero } from "@/features/landing/components/Hero";
import { StartButton } from "@/features/landing/components/StartButton";

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
