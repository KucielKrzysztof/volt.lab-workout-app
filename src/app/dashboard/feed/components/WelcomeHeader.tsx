import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface WelcomeHeaderProps {
	name: string;
}

export const WelcomeHeader = ({ name }: WelcomeHeaderProps) => {
	return (
		<div className="flex flex-col items-center py-6 gap-2">
			<div>
				<h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
					WELCOME BACK, <span className="text-primary underline decoration-2 underline-offset-4">{name.toUpperCase()}</span>
				</h1>
			</div>

			<Avatar className="h-12 w-12 border-2 border-primary/20 shadow-lg shadow-primary/10">
				<AvatarImage src="" /> {/* Later from Supabase */}
				<AvatarFallback className="bg-secondary text-primary font-bold">{name.substring(0, 2).toUpperCase()}</AvatarFallback>
			</Avatar>
		</div>
	);
};
