"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/core/supabase/client";

interface UserContextType {
	user: User | null;
	isLoading: boolean;
}

const UserContext = createContext<UserContextType>({
	user: null,
	isLoading: true,
});

/**
 * Global Provider that listens to Supabase auth changes.
 * Ensures that all client components have immediate access to the current session.
 */
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const supabase = createClient();

	useEffect(() => {
		// Initial fetch
		const getUser = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			setUser(user);
			setIsLoading(false);
		};

		getUser();

		// Listen for auth changes (sign in, sign out)
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null);
			setIsLoading(false);
		});

		return () => subscription.unsubscribe();
	}, [supabase]);

	return <UserContext.Provider value={{ user, isLoading }}>{children}</UserContext.Provider>;
};

// Hook for easy access
export const useUser = () => useContext(UserContext);
