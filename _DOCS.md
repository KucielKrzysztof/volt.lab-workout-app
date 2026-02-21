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

My apologies—you're right, let's switch to **English** and dial up the technical depth. This wasn't just a simple UI update; we built a high-performance synchronization engine for user identity and achievements.

Here is the comprehensive technical documentation update for your `_DOCS.md` file.

---

## (Update: 21-02-2026)

#### **1. The "Double-Sync" Database Strategy**

To ensure the UI always reflects the user's latest identity (even in the Navbar), we implemented a bidirectional synchronization flow using PostgreSQL triggers.

- **Profile Table Schema**: The `public.profiles` table acts as the primary source of truth for application-specific data, including `display_name`, `avatar_url`, and a `personal_records` JSONB column.
- **Automatic Provisioning**: The `handle_new_user()` trigger ensures every new Auth signup immediately receives a corresponding profile record.
- **Metadata Synchronization**: The `sync_profile_to_auth()` trigger replicates changes from the `profiles` table directly into `auth.users(raw_user_meta_data)`. This allows client-side components to read user data directly from the JWT session.

#### **2. JSONB-Driven Record Management**

Instead of a normalized table for Personal Records (PRs), we opted for a **JSONB array** inside the `profiles` table.

- **Efficiency**: This allows the application to fetch the entire user profile and all personal bests in a single query, significantly reducing database round-trips.
- **Upsert Logic**: The `profileService.addEditPersonalRecord` implements an intelligent "find-or-append" algorithm in JavaScript before pushing the updated array back to Supabase.

#### **3. High-Performance SSR Hydration**

To eliminate Cumulative Layout Shift (CLS) and "loading flickers," we implemented a specialized server-side data fetching layer.

- **Request Memoization**: The `getServerProfile` helper uses React’s `cache()` function to ensure that multiple calls within a single request (e.g., in a layout and a page) only trigger one database fetch.
- **Initial Data Injection**: Pages fetch profile data on the server and pass it as `initialProfile` to client components.
- **TanStack Query Hydration**: The `useProfile` hook uses this initial data to populate the cache immediately, allowing for an "instant-on" user experience while fetching the freshest data in the background.

#### **4. Storage & Media Pipeline**

User avatars are managed through a dedicated Supabase Storage bucket with automated URL persistence.

- **Avatar Orchestration**: The `uploadAvatar` method handles unique filename generation, binary upload to the `avatars` bucket, and public URL retrieval in a single transaction.
- **Session Refreshing**: Since DB triggers update the `auth.users` table, the client hook calls `supabase.auth.refreshSession()` after successful uploads to force-update the local JWT token and the `UserProvider` state.

---

### **Detailed Component & Service Map**

| Feature             | Location                                         | Technical Responsibility                                                        |
| ------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------- |
| **Server Helper**   | `features/profile/api/get-server-profile.ts`     | Server-side identity fetch with React `cache`.                                  |
| **Profile Service** | `services/apiProfile.ts`                         | CRUD operations for profiles, JSONB record logic, and Storage uploads.          |
| **Identity Hook**   | `features/profile/_hooks/use-profile.ts`         | State management, cache invalidation, and Auth session refreshing.              |
| **Avatar UI**       | `features/profile/components/AvatarUpload.tsx`   | Interactive file selection using Shadcn `Avatar` primitives and loading states. |
| **Shared Records**  | `features/analytics/sections/RecordsSection.tsx` | Reusable PR visualization with dynamic year filtering.                          |

---

### **Directory Structure Evolution**

```text
src/
├── app/
│   ├── (dashboard)/
│   │   ├── analytics/page.tsx      <-- Injects SSR profile data
│   │   └── profile/page.tsx        <-- Main identity management shell
│   └── layout.tsx                  <-- Global Providers & Sonner Toast config
├── core/
│   └── providers/
│       └── UserProvider.tsx        <-- React Context for real-time Auth session
├── features/
│   ├── profile/
│   │   ├── _hooks/use-profile.ts   <-- Central state & mutation logic
│   │   ├── api/get-server-profile.ts <-- Memoized server fetcher
│   │   └── components/             <-- Atomic profile UI units
│   └── analytics/
│       └── components/sections/    <-- Shared achievement components
└── services/
    └── apiProfile.ts               <-- Core Supabase interaction layer

```

---

### Next Steps

- ...

---
