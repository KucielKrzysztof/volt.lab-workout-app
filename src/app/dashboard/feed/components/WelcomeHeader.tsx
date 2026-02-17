import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface WelcomeHeaderProps {
	name: string;
}

export const WelcomeHeader = ({ name }: WelcomeHeaderProps) => {
	return (
		<div className="flex justify-between items-center py-6 gap-2 w-full">
			<div className="text-2xl font-black tracking-tight flex flex-col items-start gap-2 ">
				<p>WELCOME BACK,</p>
				<p className="text-primary underline decoration-2 underline-offset-4">{name.toUpperCase()}</p>
			</div>

			<Avatar className="h-12 w-12 sm:h-25 sm:w-25 border-2 border-primary/20 shadow-lg shadow-primary/10">
				<AvatarImage src="" /> {/* Later from Supabase */}
				<AvatarFallback className="bg-secondary text-primary font-bold sm:text-xl">{name.substring(0, 2).toUpperCase()}</AvatarFallback>
			</Avatar>
		</div>
	);
};
