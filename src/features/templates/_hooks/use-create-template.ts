import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/core/supabase/client";
import { templateService } from "@/services/apiTemplates";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CreateTemplateInput } from "@/types/templates";

export const useCreateTemplate = (userId: string) => {
	const supabase = createClient();
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: async (input: CreateTemplateInput) => {
			return templateService.createTemplate(supabase, userId, input.name, input.exercises);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["templates", userId] });
			toast.success("Routine created! 🦾");
			router.push("/dashboard/workouts");
		},
		onError: (error: unknown) => {
			let message = "An unexpected error occurred";

			if (error instanceof Error) {
				message = error.message;
			} else if (typeof error === "string") {
				message = error;
			}

			toast.error(`Failed to create template: ${message}`);
		},
	});
};
