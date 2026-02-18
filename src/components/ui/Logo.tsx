import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoProps {
	size?: number;
	className?: string;
}

export const Logo = ({ size = 100, className }: LogoProps): React.JSX.Element => {
	return (
		<div
			className={cn("bg-primary relative overflow-hidden rounded-full shadow-lg shadow-primary/20 flex-shrink-0", className)}
			style={{ width: size, height: size }}
		>
			<Image
				src="/logos/logo-1.png"
				alt="VOLT.LAB Logo"
				fill
				priority
				className="object-contain p-[20%] transition-all duration-300 dark:invert"
				sizes={`${size} px`}
			/>
		</div>
	);
};
