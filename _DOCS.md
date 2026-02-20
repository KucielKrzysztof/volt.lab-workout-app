# ⚡ VOLT.LAB - Progress Documentation

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** Supabase (PostgreSQL)
- **State Management:** TanStack Query v5 (React Query)
- **Styling:** Tailwind CSS 4 + Shadcn UI
- **Icons:** Lucide React

---

## Table of Contents

| Date           | Milestone                                          | Key Features                                       |
| :------------- | :------------------------------------------------- | :------------------------------------------------- |
| **19-02-2026** | [**Data Architecture & Core**](#update-19-02-2026) | SSR/CSR Hybrid, Supabase Trinity, Service Layer    |
| **20-02-2026** | [**Security & Identity**](#update-20-02-2026)      | Auth Guard (Proxy), PKCE Flow, Global User Context |

---

## (Update: 19-02-2026)

### Data Architecture (The "Core")

The primary challenge was bridging **SSR (Server Side Rendering)** with real-time interactive filtering. We implemented a **Dependency Injection** pattern for the Supabase client to ensure consistency across environments.

#### 1. The Supabase "Trinity" (`src/core/supabase`)

We maintain three distinct clients to handle the Next.js lifecycle:

- `server.ts`: Used in Server Components for initial data fetching.
- `client.ts`: Used in `"use client"` components for React Query and user interactions.
- `middleware.ts`: Responsible for refreshing the user session on every request.

#### 2. Service Layer (`src/services/apiExercises.ts`)

The `exerciseService` is the brain of the operation. It accepts a `supabase` instance as an argument.

> **Why?** This allows the same `getAllExercises` function to run on both the server and the client - we simply inject the appropriate "engine" (client) based on the execution context.

---

### Data Flow

Here is how data travels from the database to the screen:

1. **Server (page.tsx):** The `getExercisesServer()` function initializes the server client, fetches the data, and passes it to the client component as `initialExercises`.
2. **Hydration (TanStack Query):** The `ExercisesClientView` component "primes" the React Query cache using `initialData`.
3. **Client (Hook):** The `useExercises` hook takes control. If the cache is fresh, it suppresses unnecessary network requests to Supabase.
4. **UI:** Data from the hook flows into `useExerciseFilter`, which handles Search and (upcoming) Muscle Group filtering instantly without page reloads.

---

### File Structure (Where is everything?)

```text
src/
├── app/(dashboard)/exercises/
│   ├── page.tsx              <-- Clean Server Component (Layout + SSR)
│   └── components/           <-- Page-specific components
├── core/
│   ├── supabase/             <-- Database connection config
│   └── providers/            <-- QueryProvider (TanStack Query Context)
├── features/exercises/
│   ├── _hooks/               <-- Logic: use-exercise (data), use-exercise-filter (UI)
│   ├── api/                  <-- Wrappers: get-exercises-server.ts
│   └── components/           <-- Atomic units: ExerciseListItem, ExerciseSearch
├── services/
│   └── apiExercises.ts       <-- Pure SQL / Supabase logic
└── types/
    └── exercises.ts          <-- TypeScript Interfaces

```

---

## (Update: 20-02-2026)

### Authentication & Security Layer

The focus of this update was to secure the application and establish a robust **User Context**. We implemented a full authentication cycle using Supabase Auth with an emphasis on security and UI responsiveness.

#### 1. The "Border Guard" (`src/proxy.ts`)

In line with Next.js 16 conventions, we replaced the deprecated `middleware.ts` with `proxy.ts`. This file serves as the application's security gatekeeper:

- **Auth Guarding:** Automatically redirects unauthenticated users away from `/dashboard/**` routes to `/auth/login`.
- **Session Sync:** Ensures the user session is refreshed and cookies are synchronized before any page rendering or route handler execution.
- **Redundancy Prevention:** Logged-in users are automatically diverted from the landing/auth pages back to the dashboard.

#### 2. Error Handling (PKCE Flow)

The `auth/callback` route was hardened to prevent "silent failures".

- **Error Propagation**: If the PKCE code exchange fails (e.g., expired link or network error), the system now redirects to /auth/auth-error passing a dynamic error message via query parameters.
- **Error UI**: A dedicated Client Component captures these parameters and displays a user-friendly explanation and recovery path.

#### 3. Global User State (`src/core/providers/UserProvider.tsx`)

We implemented a **UserProvider** using React Context to make the current session available throughout the entire component tree.

- **useUser Hook:** Provides a clean interface to access `user` data and `isLoading` states in client components.
- **Dynamic UI:** Integrated the session data into the `WelcomeHeader` and `DesktopNav`, using custom helpers to derive initials and display names from user emails.

#### 4. Logic Decoupling (Custom Hooks)

Following our clean architecture principles, we moved all authentication business logic into custom hooks:

- `useAuthForm`: Manages login/registration state, loading status, and Supabase interaction.
- `useLogout`: Handles secure sign-out, session clearing, and dashboard lock-down.

---

### Updated File Structure

```text
src/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx       <-- Moved to subfolder
│   │   ├── register/page.tsx    <-- Moved to subfolder
│   │   ├── auth-error/page.tsx  <-- NEW: Error visualization
│   │   └── callback/route.ts    <-- PKCE Code Exchange handler
├── core/
│   ├── providers/
│   │   └── UserProvider.tsx    <-- Global Auth Context
│   └── supabase/
│       └── middleware.ts       <-- Specialized client for Proxy/Middleware logic
├── features/auth/
│   ├── _hooks/use-auth-form.ts <-- Logic for sign-in and sign-up
│   └── components/AuthForm.tsx <-- UI for Authentication
├── lib/utils/helpers.ts        <-- helpers
└── proxy.ts                    <-- Central Security Gatekeeper

```

---

### Next Steps

- **MuscleGroupFilter:** Complete the implementation of the horizontal.

---
