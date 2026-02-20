import { AuthForm } from "@/features/auth/components/AuthForm";

/**
 * Register Page entry point.
 * Renders the shared AuthForm component in 'register' mode.
 */
export default function RegisterPage() {
	return <AuthForm formMode="register" />;
}
