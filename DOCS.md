## ⚡ VOLT.LAB - Architecture Documentation (As of Feb 19, 2026)

### 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** Supabase (PostgreSQL)
- **State Management:** TanStack Query v5 (React Query)
- **Styling:** Tailwind CSS 4 + Shadcn UI
- **Icons:** Lucide React

---

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

### 🔄 Data Flow

Here is how data travels from the database to the screen:

1. **Server (page.tsx):** The `getExercisesServer()` function initializes the server client, fetches the data, and passes it to the client component as `initialExercises`.
2. **Hydration (TanStack Query):** The `ExercisesClientView` component "primes" the React Query cache using `initialData`.
3. **Client (Hook):** The `useExercises` hook takes control. If the cache is fresh, it suppresses unnecessary network requests to Supabase.
4. **UI:** Data from the hook flows into `useExerciseFilter`, which handles Search and (upcoming) Muscle Group filtering instantly without page reloads.

---

### 📂 File Structure (Where is everything?)

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

### 📝 TODO / Next Steps

- **MuscleGroupFilter:** Complete the implementation of the horizontal.
- **UserAuth**: I think i will focus on google oauth and that's it.

---
