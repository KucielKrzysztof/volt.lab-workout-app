import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for use in Client Components ("use client").
 * It automatically uses the browser's 'document.cookie' to manage the session.
 * Use this for user interactions, real-time updates, and TanStack Query fetching.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export const createClient = () => createBrowserClient(supabaseUrl!, supabaseKey!);
