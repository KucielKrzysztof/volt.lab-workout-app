import { ErrorState } from "@/components/ui/ErrorState";

interface ExerciseErrorStateProps {
	message?: string;
	onRetry: () => void;
}

/**
 * Specialized error view for the Exercise Library.
 * Provides user-friendly context when exercise data cannot be retrieved from the lab.
 * * @param {string} message - The specific error message to display.
 * @param {Function} onRetry - Callback to re-trigger the data fetch.
 */
export const ExerciseErrorState = ({ message, onRetry }: ExerciseErrorStateProps) => (
	<ErrorState title="Connection Lost" message={message || "Failed to load exercises from the lab."} onRetry={onRetry} />
);
