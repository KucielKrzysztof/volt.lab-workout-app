import { AuthForm } from "@/features/auth/components/AuthForm";

/**
 * Login Page entry point.
 * Renders the shared AuthForm component in 'login' mode.
 */
export default function LoginPage() {
	return <AuthForm formMode="login" />;
}
