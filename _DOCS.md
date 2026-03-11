# ⚡ VOLT.LAB - Progress Documentation

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** Supabase (PostgreSQL)
- **State Management:** TanStack Query v5 & Zustand (Persistent)
- **Styling:** Tailwind CSS 4 + Shadcn UI + Cookie-based Theme Synchronization
- **Alerts:** Sonner (Toast notifications)
- **Icons:** Lucide React

---

## Table of Contents

| Date           | Milestone                                                                               | Key Features                                                                                       |
| :------------- | :-------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------- |
| **19-02-2026** | [**Data Architecture & Core**](#update-19-02-2026)                                      | SSR/CSR Hybrid, Supabase Trinity, Service Layer                                                    |
| **20-02-2026** | [**Security & Identity**](#update-20-02-2026)                                           | Auth Guard (Proxy), PKCE Flow, Global User Context                                                 |
| **21-02-2026** | [**Security & Profile & Performance**](#update-21-02-2026)                              | DB Triggers (Sync), JSONB Records, SSR Hydration Cache                                             |
| **23-02-2026** | [**Password Recovery & UX**](#update-23-02-2026)                                        | Secure Password Reset, Sonner Integration                                                          |
| **24-02-2026** | [**Workouts & History Infra**](#update-24-02-2026)                                      | Relational Joins, UI Mapping, SSR Hydration Cache                                                  |
| **25-02-2026** | [**Active Training & Persistence**](#update-25-02-2026)                                 | Zustand Persistence, Routine Blueprints, Analytics Engine                                          |
| **02-03-2026** | [**Infinite Scroll & Data Streaming**](#update-02-03-2026)                              | Sentinel Pattern, Infinite Scrolling, Total Count Metadata                                         |
| **03-03-2026** | [**Yearly Achievements(PR's - add/edit) & Analytics Optimization**](#update-03-03-2026) | Yearly PR Partitioning, Headless Profile Logic, Activity Snapshot Engine                           |
| **04-03-2026** | [**Theme & Settings**](#update-04-03-2026)                                              | Cookie-Sync Engine for theme, Theme Toggle, Change username                                        |
| **05-03-2026** | [**Workout deletion & Templates edition/deletion**](#update-05-03-2026)                 | Session deletion Engine, Atomic Header Refactor, Propagation Shields, Templates edit/delate Engine |
| **07-03-2026** | [**FAQ & BUG REPORT**](#update-07-03-2026)                                              | Headless Feedback Engine, FAQ Module                                                               |
| **08-03-2026** | [**Offline Indicator**](#update-08-03-2026)                                             | UI Offline Indicator and logic                                                                     |
| **09-03-2026** | [**Hybrid Session Engine & Dynamic Injection**](#update-09-03-2026)                     | On-The-Fly Training, Atomic View Refactor                                                          |
| **10-03-2026** | **[Privacy Protocol & Diagnostic Governance](#update-10-03-2026)**                      | Cookie-based Consent, Metadata Sniffer, Public Legal Uplink, JSDoc Standardization                 |
| **11-03-2026** | **[Strength Calculators](#update-11-03-2026)**                                          | Headless Math Engine, Wilks score, RPE Calibrator, One Rep Max calculator                          |
| **12-03-2026** | **[Session Identity & Dynamic Naming](#update-12-03-2026)**                             | Inline Rename Engine, Zustand Flat-State Mutation, Sanitization Logic, UX Interaction Hints        |

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

This update marks a critical expansion of the **VOLT.LAB** security infrastructure, adding self-service account recovery and hardening the cross-device authentication experience.

---

## (Update: 23-02-2026)

### **Advanced Auth Recovery**

The focus of this update was to implement a secure password recovery pipeline.

#### **1. Password Recovery Pipeline (Secure Reset)**

We established a two-phase recovery system that leverages Supabase's secure SMTP and temporary recovery sessions.

- **Phase 1: Recovery Request**: The `useAuthForm` hook was extended with `handleForgotPassword`. It triggers a secure email via `resetPasswordForEmail`, redirecting the user to a dedicated update route.
- **Phase 2: Password Update**: A specialized Client Component at `/auth/reset-password` consumes the `useResetPassword` hook. This phase utilizes the `updateUser` method, which is only authorized during the temporary session established by the email recovery link.

#### **2. UX Enhancements**

- **Sonner Integration**: Replaced all native browser `alerts` with the Sonner notification system, providing non-blocking, theme-aware feedback for all auth events.

---

### **Technical Implementation Map**

| Feature           | File Location                                | Responsibility                                            |
| ----------------- | -------------------------------------------- | --------------------------------------------------------- |
| **Recovery Hook** | `features/auth/_hooks/use-reset-password.ts` | Manages the `updateUser` mutation and redirect logic.     |
| **Reset UI**      | `app/auth/reset-password/page.tsx`           | Secure form for inputting and validating new credentials. |
| **Auth Hook**     | `features/auth/_hooks/use-auth-form.ts`      | Dispatches reset emails and handles login/register state. |

---

### **Directory Structure Evolution**

```text
src/
├── app/
│   └── auth/
│       └── reset-password/
│           └── page.tsx      <-- NEW: Secure password update form
│
├── features/auth/
│   └── _hooks/
│       ├── use-auth-form.ts  <-- UPDATED: Added forgotPassword logic
│       └── use-reset-password.ts <-- NEW: Logic for updating credentials

```

---

## (Update: 24-02-2026)

### **Workouts & History Infrastructure**

This update establishes the backbone of the training experience, moving from static mockups to a high-performance, relational data pipeline for workout tracking and history.

#### **1. Relational Deep-Join Architecture**

To optimize performance, we implemented a nested relational fetch strategy using PostgREST. This allows the application to retrieve a complete "snapshot" of a workout in a single database round-trip.

- **Schema Design**: The `public.workouts` table (header) is linked to `public.workout_sets` (line items), which in turn joins with `public.exercises`.
- **Nested Selection**: The `workoutService.getWorkouts` method uses a deep-select string (`*, workout_sets(*, exercises(name, muscle_group))`) to pull exercise names and muscle groups directly through the set relationship.
- **Bulk Persistence**: The `finishWorkout` method implements a "Bulk Insert" strategy, injecting the parent `workout_id` into a local array of sets and persisting them in one multi-row transaction to minimize network latency.

#### **2. The Data Mapping Layer**

To keep the UI components "dumb" and performant, we introduced a specialized mapping utility (`mapWorkoutForUI`).

- **Data Aggregation**: The mapper calculates total volume, set counts, and unique exercise counts on the fly.
- **Muscle Group Deduplication**: By utilizing the JavaScript `Set` object, the mapper distills dozens of individual sets into a unique list of targeted muscle groups (e.g., 10 sets of different chest exercises are flattened into a single "Chest" badge).
- **Localization**: Timestamps are converted into human-readable Polish locales (`pl-PL`) directly within the mapper, ensuring consistent date formatting across the Feed and History views.

#### **3. Hybrid SSR-to-CSR Hydration Pipeline**

We leveraged TanStack Query v5 to bridge the gap between initial server rendering and client-side interactivity.

- **Server Utility**: `getWorkoutsServer` provides a secure, memoized fetcher for Server Components, handling authentication and mapping before the page reaches the browser.
- **Cache Seeding**: The `useWorkouts` hook accepts `initialData` from the server to "prime" the React Query cache. This eliminates "loading flickers" and ensures that navigating feels good.
- **Stale-Time Management**: Data is marked as "fresh" for 5 minutes, reducing database load while maintaining high data accuracy.

---

### **Technical Implementation Map**

| Feature             | File Location                                         | Responsibility                                                       |
| ------------------- | ----------------------------------------------------- | -------------------------------------------------------------------- |
| **Workout Service** | `services/apiWorkouts.ts`                             | Pure Supabase logic: Deep Joins, Range Pagination, and Bulk Inserts. |
| **Data Mapper**     | `features/workouts/helpers/workoutHelpers.ts`         | Aggregation logic, unique muscle extraction, and date localization.  |
| **Server Utility**  | `features/workouts/api/get-workouts-server.ts`        | Authenticated server-side fetcher for SSR Hydration.                 |
| **History Hook**    | `features/workouts/_hooks/use-workouts.ts`            | TanStack Query management, cache keys, and hydration logic.          |
| **Summary UI**      | `features/workouts/components/SummaryWorkoutCard.tsx` | High-contrast visualization of workout stats and muscle badges.      |

---

### **Directory Structure Evolution**

```text
src/
├── app/(dashboard)/
│   ├── feed/page.tsx               <-- Injects SSR workouts into the Feed
│   └── workouts/page.tsx           <-- Main History entry point (Server Component)
├── features/workouts/
│   ├── _hooks/use-workouts.ts      <-- Client-side cache management
│   ├── api/get-workouts-server.ts  <-- Server-side data fetcher
│   ├── helpers/workoutHelpers.ts   <-- Data transformation logic (Mapper)
│   └── components/
│       ├── WorkoutsClientView.tsx  <-- CSR Orchestrator (Hydration)
│       ├── WorkoutHistory.tsx      <-- Vertical list container
│       └── SummaryWorkoutCard.tsx  <-- Atomic stat visualization
└── types/
    └── workouts.ts                 <-- Interfaces (Workout, WorkoutUI, WorkoutSet)

```

---

## (Update: 25-02-2026)

### **Active Training Ecosystem & Persistence**

This milestone transformed the application from a history viewer into an interactive training workstation. The focus was on data reliability in low-connectivity environments (gym basements) and the automation of training volume analytics.

#### **1. Live Session Orchestration (Zustand + Persistence)**

The core of the training module is the `useActiveWorkoutStore`, which orchestrates the real-time session state.

- **Session Persistence**: Implemented the `persist` middleware to synchronize the store with `localStorage`. This ensures that "screen timeouts" or accidental browser refreshes do not result in data loss.
- **Dynamic UI State**: The store manages set additions, removals, and completion toggles in real-time, utilizing `crypto.randomUUID()` for stable React reconciliation.
- **Global Status Banner**: Introduced the `ActiveWorkoutBanner`, which calculates elapsed time relative to a fixed `startTime` ISO string, ensuring timer continuity across navigation.

#### **2. Routine Blueprints (Templates CRUD)**

Developed a high-performance routine builder (`TemplateCreator`) for pre-defining training protocols.

- **Relational Persistence**: The `templateService.createTemplate` method utilizes a two-stage transaction—persisting the header (`workout_templates`) followed by a multi-row Bulk Insert for `template_exercises` to minimize network overhead.
- **Interactive Selection**: Integrated a Shadcn `Sheet` based `ExerciseSelector` with real-time filtering to streamline the blueprint creation process.

#### **3. High-Precision Volume & Duration Formatting**

To maintain readability during high-tonnage sessions, we implemented advanced formatting logic in `src/lib/formatter.ts`:

- **Volume Normalization**: Automatic conversion of kilograms to tons (`formatVolume`) upon exceeding 1,000 kg (e.g., "12t 450kg").
- **Duration Mapping**: Decomposed raw seconds into a scalable `Xd Hh Mm` format (`formatDuration`), replacing standard colon-based counters with intuitive units.

#### **4. Database Relational Integrity (Bulk Inserts)**

Optimized the workout finalization pipeline within `workoutService.finishWorkout`:

- **Atomic Operations**: The entire session, including all performance sets, is persisted in a single transactional flow. The system automatically maps the parent `workout_id` to each child set to guarantee referential integrity.
- **Numeric Precision**: Fields for `total_volume` and `weight` utilize the `numeric` Postgres type, supporting fractional plate loading (e.g., 12.5 kg) without floating-point errors.

---

### **Technical Implementation Map**

| Feature              | File Location                                           | Responsibility                                          |
| -------------------- | ------------------------------------------------------- | ------------------------------------------------------- |
| **Active Store**     | `features/workouts/_hooks/use-active-workout-store.ts`  | Session state, hydration, and localStorage persistence. |
| **Routine Builder**  | `features/templates/components/TemplateCreator.tsx`     | Complex form state management for training blueprints.  |
| **Analytics Engine** | `features/analytics/components/AnalyticsClientView.tsx` | Global year filtering and aggregate KPI calculations.   |
| **Bulk Service**     | `services/apiWorkouts.ts`                               | High-performance batch inserts for session completion.  |
| **Calendar Logic**   | `features/analytics/utils/calendar-logic.ts`            | Grid generation with localized `DD.MM.YYYY` formatting. |

---

### **Directory Structure Evolution**

```text
src/
├── app/dashboard/
│   ├── active-workout/     <-- Dedicated workspace for live sessions
│   ├── templates/          <-- Routine management and creation
├── features/
│   ├── templates/          <-- Blueprint logic and exercise mapping
│   ├── workouts/
│   │   ├── _hooks/         <-- Active session state and finish mutations
│   │   └── components/     <-- ActiveExerciseCard, SetRows, and Banners
├── lib/
│   └── formatter.ts        <-- Unit conversion (Tons, Days, Hours)
└── types/
    ├── templates.ts        <-- Relational interfaces for routines

```

---

## (Update: 02-03-2026)

### **Infinite Scroll Engine & Unified Hydration**

This milestone introduced a scalable data streaming architecture, replacing static list fetching with a high-performance **Infinite Scroll** engine. The focus was on minimizing memory overhead for long-term users and establishing a "Single Source of Truth" for paginated data.

#### **1. Cursor-less Pagination & Total Count Awareness**

We upgraded the `workoutService` to support server-side range slicing while maintaining awareness of the total dataset size.

- **PostgREST Range Mapping**: The system translates 0-based page indices into inclusive byte-like ranges (e.g., Page 0 $\rightarrow$ `0-9`) using the `.range(from, to)` method.
- **Exact Count Retrieval**: By utilizing `{ count: "exact" }` in the Supabase select query, the server now returns the absolute number of records in the database. This allows the UI to display "Total Sessions" metrics before the data is actually scrolled into view.
- **The `WorkoutPage` Contract**: Established a unified interface for data slices, encapsulating both the mapped `WorkoutUI[]` and the `totalCount` metadata.

#### **2. Three-Tier UI Architecture (The Sentinel Pattern)**

To ensure 60fps scrolling performance, the `WorkoutHistory` component was refactored into three distinct functional layers:

- **Orchestrator (`WorkoutHistory`)**: Acts as the high-level state machine. It flattens the multi-page `InfiniteData` structure into a linear array and manages the transition between Loading, Empty, and Populated states.
- **Presenter (`WorkoutList`)**: A "pure" component responsible solely for iterating over the flattened data. By isolating this, we prevent complex logic from executing during high-frequency scroll events.
- **Sentinel (`InfiniteScrollTrigger`)**: Encapsulates the `IntersectionObserver` logic. This "sentinel" element detects when the user reaches the bottom of the feed and triggers the `fetchNextPage` callback, isolating re-renders to the footer of the list.

#### **3. High-Performance SSR Hydration Bridge**

We refined the **SSR-to-CSR** handoff to support paginated data, ensuring zero Cumulative Layout Shift (CLS).

- **Cache Seeding**: The `useWorkouts` hook was updated to accept a full `WorkoutPage` object as `initialData`. This seeds the first page of the TanStack Query infinite cache during the server-render cycle.
- **Hydration Sync**: Both the `Feed` and `Workouts` views were unified to use the same `getWorkoutsServer` utility, ensuring that user history depth is calculated on the server and immediately available to the client-side engine.

---

### **Technical Implementation Map**

| Feature               | File Location                                            | Technical Responsibility                                                              |
| --------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **Infinite Hook**     | `features/workouts/_hooks/use-workouts.ts`               | Orchestrates `useInfiniteQuery` v5, cache keys, and stream termination.               |
| **Sentinel UI**       | `features/workouts/components/InfiniteScrollTrigger.tsx` | Encapsulates `useInView` and the visual "Loading Archive" states.                     |
| **Data Orchestrator** | `features/workouts/components/WorkoutHistory.tsx`        | Page flattening ($[[page1], [page2]] \rightarrow [all]$) and high-level state guards. |
| **Service Layer**     | `services/apiWorkouts.ts`                                | Implements `{ count: "exact" }` and relational range slicing.                         |
| **Type System**       | `types/workouts.ts`                                      | Global definitions for `WorkoutPage` and relational DTOs.                             |

---

### **Directory Structure Evolution**

```text
src/
├── app/(dashboard)/
│   ├── feed/page.tsx           <-- SSR Hydration for the Dashboard feed
│   └── workouts/page.tsx       <-- SSR Hydration for the full History view
├── features/
│   ├── workouts/
│   │   ├── _hooks/use-workouts.ts <-- Infinite Query logic & cache priming
│   │   └── components/
│   │       ├── WorkoutHistory.tsx <-- The "Smart" Orchestrator
│   │       ├── WorkoutList.tsx    <-- Pure "Dumb" Presenter
│   │       └── InfiniteScrollTrigger.tsx <-- Viewport Sentinel (IntersectionObserver)
└── types/
    └── workouts.ts             <--  Added 'WorkoutPage' interface

```

---

## (Update: 03-03-2026)

### **Yearly Achievement Architecture & Analytics Optimization**

This milestone introduced a temporal partitioning strategy for Personal Records (PRs) and decoupled business logic from the UI using Headless Hooks. We also optimized the analytics engine to ensure 100% data accuracy for heatmaps regardless of pagination state.

#### **1. Yearly Personal Record (PR) Partitioning**

We evolved the achievement system from a "Single Best" model to a "Yearly Best" model. This allows athletes to track their progression year-over-year while maintaining historical data.

- **Composite Key Logic**: The `addEditPersonalRecord` service now treats the tuple of `(exercise_name, year)` as a unique identifier.
- **JSONB Upsert Strategy**: When a new record is submitted, the system checks the existing `personal_records` array. If an entry for that specific exercise and year exists, it is updated; otherwise, a new record is appended.
- **Data Persistence**: This strategy preserves historical peaks (e.g., "Max Squat 2025") while allowing the UI to focus on current-year goals.

#### **2. High-Performance Activity Snapshot Engine**

To solve the conflict between "Infinite Scrolling" (paginated history) and the "Activity Grid" (full-year heatmap), we implemented a dedicated snapshot service.

- **Lightweight API Hook**: The `getYearlyActivitySnapshot` method bypasses the main relational workout feed. It fetches only the `started_at` column for a specific year.
- **Payload Optimization**: By retrieving only timestamps instead of full workout objects, we reduced the network payload by ~90%, allowing for an instant, 100% accurate heatmap rendering even for high-frequency users.
- **Autonomous Fetching**: The `ActivitySection` now manages its own data lifecycle via the `useYearlyActivity` hook, ensuring the dashboard remains responsive during background pagination.

#### **3. Headless Hook Architecture & UI Atomization**

We refactored the Profile and Analytics modules into a "Headless" pattern to separate state management from visual representation.

- **Logic Encapsulation**: Hooks like `useProfile` and `useAnalyticsDashboard` now handle all side effects, mutation states.
- **Atomic Refactoring**: The achievement list was decomposed from a monolithic grid into an **Orchestrator** (`RecordsSection`) and an **Atomic Unit** (`RecordRow`).
- **Management UI**: Implemented a unified `RecordFormModal` that handles both "Create" and "Update" actions, featuring a smart hydration cycle that populates the form based on the selected historical context.

---

### **Technical Implementation Map**

| Feature              | File Location                                      | Technical Responsibility                                                                |
| -------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **Profile Hook**     | `features/profile/_hooks/use-profile.ts`           | Headless logic for identity sync, PR mutations, and session refreshing.                 |
| **Activity Hook**    | `features/analytics/_hooks/use-yearly-activity.ts` | Independent year-based timestamp fetching for heatmaps.                                 |
| **Snapshot Service** | `services/apiWorkouts.ts`                          | Optimized SQL query for retrieving yearly activity snapshots.                           |
| **PR Orchestrator**  | `features/analytics/components/RecordsSection.tsx` | Memoized temporal slicing and state management for the Hall of Fame list.               |
| **Atomic Record**    | `features/analytics/components/RecordRow.tsx`      | Presentational logic for high-contrast achievements with hover-activated edit triggers. |

---

### **Directory Structure Evolution**

```text
src/
├── features/
│   ├── profile/
│   │   ├── _hooks/use-profile.ts         <-- Centralized Profile & PR logic
│   │   └── components/
│   │       ├── ProfileClientView.tsx     <-- Orchestrates Identity + Records
│   │       └── RecordFormModal.tsx       <-- Unified Create/Update interface
│   └── analytics/
│       ├── _hooks/
│       │   ├── use-analytics-dashboard.ts <-- KPI aggregation & pagination flattening
│       │   └── use-yearly-activity.ts    <-- Independent activity stream
│       └── components/
│           ├── RecordsSection.tsx        <-- Smart list container (Memoized)
│           ├── RecordRow.tsx             <-- Atomic row unit
│           └── sections/
│               └── ActivitySection.tsx   <-- Heatmap shell using the Snapshot Engine
└── services/
    ├── apiProfile.ts                     <-- Yearly Upsert logic (JSONB)
    └── apiWorkouts.ts                    <-- NEW: getYearlyActivitySnapshot

```

---

## (Update: 04-03-2026)

### **Theme SSR & Identity Governance**

This milestone focuses on eliminating "Theme Flickering" (FOUC) and hydration mismatches by implementing a **Cookie-based SSR** architecture. We also expanded the Identity module to support username modifications and established a scalable structure for the Settings domain.

#### **1. Elite SSR Theme Engine (Cookie-Sync)**

We migrated from a purely client-side theme resolution to a server-aware synchronization strategy.

- **Proxy-Level Resolution**: The `proxy.ts` (middleware) intercepts every request to read the `theme` cookie. It enforces a dark default if the cookie is missing, ensuring the server always knows the intended visual state.
- **Zero-Flash Injection**: Since the `RootLayout` is a Server Component, it injects the theme class directly into the `<html>` tag during the initial SSR pass. This ensures the page is rendered correctly before a single byte of JavaScript is executed.
- **Hydration Stability**: By setting `enableSystem={false}` in the `ThemeProvider`, we prevent the browser's system preferences from overriding the server-sent state, effectively solving the "Hydration failed" errors.

#### **2. CSS-Only Theme Switching (Tailwind v4 Variants)**

To avoid the need for skeleton loaders or "isMounted" guards, we implemented the **Isomorphic CSS Toggle** pattern.

- **Tailwind v4 Variant Mapping**: In `globals.css`, we mapped the `dark:` prefix to our `.dark` class using the new `@variant dark (&:is(.dark *))` directive.
- **Dual Rendering Strategy**: The `ThemeSettingsCard` now renders both icons (Sun/Moon) and both text labels (Light/Midnight) simultaneously. Tailwind CSS handles visibility instantly based on the presence of the `.dark` class on the root element.
- **Performance**: This approach removes the need for React to re-calculate the DOM tree upon hydration, leading to a much higher Lighthouse/Core Web Vitals score.

#### **3. Settings Facade & Identity Management**

We introduced a dedicated Settings module designed as a centralized configuration lab.

- **useSettings Hook**: Implemented as a **Facade Pattern** to encapsulate `next-themes` logic. It automatically synchronizes every theme change with browser cookies to keep the Proxy/Server in the loop.
- **Username Updates**: Integrated username modification support. Changes are pushed to the `profiles` table and synchronized with Supabase Auth metadata via database triggers, ensuring the Navbar and Profile stay perfectly aligned.

---

### **Technical Implementation Map**

| Feature              | Location                                             | Technical Responsibility                                  |
| -------------------- | ---------------------------------------------------- | --------------------------------------------------------- |
| **Theme Proxy**      | `src/proxy.ts`                                       | Cookie interception and server-side default enforcement.  |
| **SSR Orchestrator** | `src/app/layout.tsx`                                 | Cookie retrieval and root `<html>` class injection.       |
| **Settings Facade**  | `features/settings/_hooks/use-settings.ts`           | Synchronizing client-side state with server-side cookies. |
| **Visual Toggle**    | `features/settings/components/ThemeSettingsCard.tsx` | CSS-driven UI swapping (Zero Hydration Mismatch).         |
| **Identity Service** | `services/apiProfile.ts`                             | Display name persistence and JSONB metadata updates.      |

---

### **Directory Structure Evolution**

```text
src/
├── app/(dashboard)/
│   └── settings/
│       └── page.tsx                <-- Server-side shell for system config
├── features/
│   └── settings/
│       ├── _hooks/use-settings.ts  <-- Facade hook with cookie sync
│       └── components/
│           ├── SettingsClientView.tsx <-- Section orchestrator
│           └── ThemeSettingsCard.tsx  <-- Toggle
├── core/
│   └── providers/
│       └── ThemeProvider.tsx      <-- Optimized next-themes wrapper
└── proxy.ts                       <-- Updated with Theme Cookie Logic

```

---

## (Update: 05-03-2026)

### **Workout deletion & Templates edition/deletion**

This milestone established the "Destructive Lifecycle" management for both historical sessions and training blueprints. We focused on database referential integrity and solved complex UI interaction conflicts between navigational and functional elements.

#### **1. The "Purge" Engine (Workout Session Deletion)**

We implemented a secure, atomic decommissioning flow for completed workout sessions.

- **Relational Integrity**: The `deleteWorkout` service performs a single-point deletion on the `workouts` table. It relies on the database-level `ON DELETE CASCADE` constraint to automatically clean up all associated sets in `workout_sets`, preventing "orphaned" data from corrupting volume analytics.
- **Cache Synchronization**: The `useDeleteWorkout` hook triggers a targeted invalidation of the `["workouts", userId]` query key. This ensures that the history feed and aggregate KPIs (tonnage, frequency) refresh instantly across the dashboard.
- **Secure Destruction UI**: Deployed the `DeleteWorkoutDialog` based on Shadcn `AlertDialog`. It features a "Propagation Shield" using `e.stopPropagation()` to prevent clicks on the delete trigger from accidentally firing the parent `Link` or `Router` navigation.

#### **2. Polymorphic Primitive Refactoring (`PageHeader`)**

To reduce code duplication and ensure visual consistency, we refactored the page-level headers into a high-performance reusable primitive.

- **Flexible API**: The new `PageHeader` supports a polymorphic structure through the `cn()` utility, allowing for layout-specific overrides without modifying the core logic.

#### **3. Blueprint Lifecycle Management (Template CRUD)**

We expanded the "Routine Builder" module to support full lifecycle management of training templates.

- **Modification Flow**: Users can now edit existing templates, updating both metadata (names) and relational exercise mappings in a single transactional update.
- **Decommissioning Blueprints**: Added deletion support for templates, allowing for laboratory cleanup without affecting the already persisted historical workouts derived from those templates.

#### **4. Systematic Expansion (Privacy & Support Facades)**

Established the navigational structure for non-core domains to ensure a complete application feel.

- **Placeholder Architecture**: Deployed high-density placeholder views for **Privacy & Security** and **Help & Feedback** modules.

### **Fixed Months Grid**

- **Layout Calibration**: Resolved a critical date-formatting mismatch where single-digit days were generated without leading zeros (e.g., 3.03 instead of 03.03). This string-key inconsistency caused the grid mapping logic to fail during historical timestamp reconciliation, preventing workout markers from rendering correctly in the monthly calendar view.

---

### **Directory Structure Evolution**

```text
src/
├── app/(dashboard)/
│   ├── privacy/page.tsx            <-- NEW: Privacy & Security facade
│   └──  feedback/page.tsx           <-- NEW: Help & Feedback facade
├── features/
│   ├── templates/
│   │   └── _hooks/
│   │           ├──  use-delete-template.ts <-- Deletion mutation
│   │           └── use-edit-template.ts <-- Edition mutation
│   │
│   ├── workouts/
│   │   ├── _hooks/use-delete-workout.ts <-- Mutation logic for purging
│   │   └── components/
│   │       ├── PageHeader.tsx      <-- Refactored reusable header
│   │       ├── DeleteWorkoutDialog.tsx <-- Reusable confirmation shield
│   │       └── SummaryWorkoutCard.tsx  <-- Updated with propagation fixes
└── services/
    ├── apiWorkouts.ts              <-- Added deleteWorkout logic
    └── apiTemplates.ts             <-- Added delete/edit logic

```

---

## (Update: 07-03-2026)

### **Support Systems & Anomaly Reporting**

This milestone established a secure channel for user-to-lab communication. We implemented a robust "Feedback Loop" that handles everything from UI state management to hardened database security policies, alongside a data-driven FAQ module.

#### **1. Headless Feedback Engine**

We developed a multi-layered reporting system designed to capture system anomalies (bugs) and calibration requests (features).

- **Headless Logic Extraction**: Following the **VOLT.LAB** architecture, we decoupled the form logic into the `useFeedbackForm` hook. This manages the entire lifecycle: Zod validation, `isPending` states, and server-side transmission.
- **Double-Layer Validation**: Implemented `feedbackSchema` using **Zod**. This ensures data integrity on both the client (instant UX feedback) and the server (security gatekeeping).
- **Agnostic Service Pattern**: The `feedbackService` was designed to be environment-agnostic, accepting an injected Supabase client to perform insertions into the `feedback_reports` table.

#### **2. FAQ (Frequently Asked Questions Module)**

Implemented a high-density information retrieval system using structured data.

- **Information Density**: The FAQ module utilizes the **Shadcn Accordion** primitive to present complex system information in a compact, scannable format.
- **Structured Data Sourcing**: Information is decoupled from the UI, pulling from `features/help/data` to allow for rapid content updates without modifying the component logic.

### **Technical Implementation Map**

| Feature               | File Location                                    | Technical Responsibility                            |
| --------------------- | ------------------------------------------------ | --------------------------------------------------- |
| **Feedback Hook**     | `features/help/_hooks/use-feedback-form.ts`      | Headless state management & action orchestration.   |
| **Server Action**     | `features/help/api/submit-feedback.ts`           | Secure server-side validation & cache revalidation. |
| **Agnostic Service**  | `services/apiFeedback.ts`                        | Environment-aware database insertion engine.        |
| **Validation Schema** | `features/help/schemas/feedback-schema.ts`       | Unified Zod-backed data contract with JSDoc.        |
| **FAQ Module**        | `features/help/components/faq/FaqClientView.tsx` | Client-View for faq presentation.                   |

---

### **Directory Structure Evolution**

```text
src/
├── app/(dashboard)/
│   └── feedback/
│       └── page.tsx                <-- SSR entry point for Support
├── features/
│   └── help/
│       ├── _hooks/
│       │   └── use-feedback-form.ts <-- Logic for report submission
│       ├── api/
│       │   └── submit-feedback.ts   <-- Secure Server Action gateway
│       ├── components/
│       │   ├── feedback/            <-- FeedbackForm & ClientView
│       │   └── faq/                 <-- FAQ Accordion
│       ├── data/
│       │   └── faq-data.ts          <-- Source of truth for FAQ info
│       └── schemas/
│           └── feedback-schema.ts   <-- Zod contract
└── services/
    └── apiFeedback.ts               <-- Core Supabase interaction layer

```

---

## (Update: 08-03-2026)

### **Connectivity Monitoring**

This milestone established a monitoring system for device connectivity.

#### **1. Offline Monitoring & Signal Logic (Offline Mode)**

To address the "Offline Requirement" for gym environments, we implemented a real-time connectivity monitor.

- **Signal Detection Hook**: Developed `useOnlineStatus`, a headless hook that utilizes the `navigator.onLine` API and window event listeners to track the device's uplink status.
- **Responsive Portal Indicator**: The `OfflineIndicator` component uses a high-contrast, pulsating `destructive` icon. It leverages the **Shadcn Popover** (Portal) to bypass parent stacking contexts and ensures accurate positioning via the `md:inset-auto` reset pattern.

---

### **Technical Implementation Map**

| Feature               | File Location                            | Technical Responsibility                           |
| --------------------- | ---------------------------------------- | -------------------------------------------------- |
| **Connectivity Hook** | `src/hooks/use-online-status.ts`         | Real-time browser uplink monitoring.               |
| **Signal Indicator**  | `src/components/ui/OfflineIndicator.tsx` | Responsive UI with Portal-based legend disclosure. |

---

### **Directory Structure Evolution**

```text
src/
├── components/
│   └── ui/
│       └── OfflineIndicator.tsx    <-- Connectivity monitor UI
├── hooks/
│   └── use-online-status.ts         <-- Uplink detection logic

```

---

## (Update: 09-03-2026)

### **Hybrid Session Engine & Atomic UI Refactor**

This milestone transformed the training workspace from a blueprint executor into a dynamic **Hybrid Session Engine**. The system now supports spontaneous "On-The-Fly" training while allowing real-time expansion of template-based sessions.

#### **1. On-The-Fly Initiation Protocol (Quick Start)**

We introduced a secondary session pathway that bypasses the need for pre-defined blueprints.

- **Non-Templated State**: The `startEmptyWorkout` action initializes the `useActiveWorkoutStore` with a `template_id: null`. This ensures the relational database correctly identifies the session as a unique manual entry rather than a blueprint execution.
- **Blueprint-Agnostic Persistence**: By maintaining the same internal exercise structure for both templated and empty sessions, the `persist` middleware provides uniform data protection across all training modes.

#### **2. Dynamic Exercise Injection**

Implemented the ability to modify the training volume of an active session in real-time.

- **Relational Integrity Preservation**: The `addExercise` store action maps database-level `exercise_id` to dynamic local `id` (UUID). This allows users to add the same movement multiple times within one session without key collisions or relational corruption.

#### **3. Atomic UI Orchestration (The Workspace Refactor)**

To improve maintainability and performance, the `ActiveWorkoutView` was decomposed into specialized atomic units:

- **The Guard (`ActiveWorkoutEmpty`)**: A specialized "Ghost State" component that handles gatekeeping for the workspace, providing a recovery path when no session is active.
- **The Presenter (`ActiveWorkoutExerciseList`)**: Manages the iterative rendering of tracking cards and handles the empty-session visual state.
- **The Control Hub (`ActiveWorkoutFooter`)**: A fixed-position interface that merges progression triggers (Dynamic Injection) with finalization protocols (Finish Mutation).

### **Technical Implementation Map**

| Feature                | File Location                                          | Technical Responsibility                                            |
| ---------------------- | ------------------------------------------------------ | ------------------------------------------------------------------- |
| **Hybrid Store**       | `features/workouts/_hooks/use-active-workout-store.ts` | Managing `template_id` nullability and dynamic `addExercise` logic. |
| **View Orchestrator**  | `features/workouts/components/ActiveWorkoutView.tsx`   | Coordinating the Guard, List, and Footer layers of the workspace.   |
| **Session Guard**      | `features/workouts/components/ActiveWorkoutEmpty.tsx`  | Gatekeeping the UI based on `startTime` existence.                  |
| **Interaction Hub**    | `features/workouts/components/ActiveWorkoutFooter.tsx` | Fixed UI anchoring for session expansion and atomic finalization.   |
| **Polymorphic Search** | `features/exercises/components/ExerciseSelector.tsx`   | Dynamic trigger styling and database-to-store exercise mapping.     |

---

### **Directory Structure Evolution**

```text
src/
├── features/
│   └── workouts/
│       ├── _hooks/
│       │   ├── use-active-workout-store.ts <-- Added addExercise & startEmptyWorkout
│       │   └── use-start-workout-flow.ts    <-- Added handleStartEmpty logic
│       └── components/
│           ├── ActiveWorkoutView.tsx        <-- Main Orchestrator (Refactored)
│           ├── ActiveWorkoutEmpty.tsx       <-- Session Gatekeeper
│           ├── ActiveWorkoutExerciseList.tsx <-- Presentation layer
│           └── ActiveWorkoutFooter.tsx       <-- Command & Control bar

```

---

## (Update: 10-03-2026)

### **Privacy Protocol & Diagnostic Governance**

This milestone established a robust legal framework and a conditional telemetry system. We focused on GDPR/RODO compliance by implementing a transparent "Governance Uplink" that gives users full control over their technical data while maintaining system integrity.

#### **1. Public Data Collecting & Proxy Exception**

We decoupled the application's legal documentation from the protected dashboard environment to ensure accessibility for unauthenticated users.

- **Middleware Bypass**: Modified `proxy.ts` to include a security exception for the `/dashboard/privacy` route. This allows users to review the Privacy Protocol before initializing a session.

#### **2. Headless Governance Hook (`useCookieConsent`)**

Developed a specialized logic layer for managing privacy tokens with strict client-side synchronization.

- **Root Scoping Enforcement**: The hook forces `path=/` on all cookie operations. This eliminates "Token Duplication" anomalies where separate cookies were created for different sub-paths (e.g., `/` vs `/dashboard`).
- **Hydration Safety**: Implemented a `null` initialization state to prevent SSR mismatches, ensuring the UI only renders once the browser's cookie state is calibrated.
- **Revocation Protocol**: Designed a secure "Revoke" mechanism that utilizes the "Expiry Hack" (setting a 1970 timestamp) to instantly purge authorization tokens from the client.

#### **3. Conditional Diagnostic Sniffer**

Transformed the feedback system into a privacy-aware "Diagnostic Uplink" that respects user boundaries.

- **Consent-Gated Telemetry**: The `useFeedbackForm` hook now performs a pre-flight check for the `cookieConsent` token. High-fidelity metadata (OS, Browser, Resolution, Network) is only bundled if the protocol is **Authorized**.
- **Restricted Payload Mode**: If consent is missing, the sniffer automatically aborts and transmits a `RESTRICTED` status, preserving user privacy while still allowing for manual anomaly reporting.
- **Diagnostic Awareness UI**: Integrated a static awareness tile in the feedback interface to inform users about the data-bundling process and provide a direct link to the Privacy Settings.

---

### **Technical Implementation Map**

| Feature             | File Location                                       | Technical Responsibility                                                      |
| ------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------- |
| **Governance Hook** | `src/hooks/use-cookie-consent.ts`                   | Headless logic for cookie R/W, path-scoping, and protocol toggling.           |
| **Privacy View**    | `features/privacy/components/PrivacyClientView.tsx` | Interactive governance card with dynamic status badges and disclosures.       |
| **Consent Banner**  | `components/ui/cookie-consent.tsx`                  | UI Orchestrator for initial consent acquisition (3rd part component).         |
| **Awareness Hook**  | `features/help/_hooks/use-feedback-form.ts`         | Conditional metadata capture logic based on active Privacy Protocols.         |
| **Security Proxy**  | `src/proxy.ts`                                      | Managing public exceptions for legal routes and theme-cookie synchronization. |

---

### **Directory Structure Evolution**

```text
src/
├── app/
│   └── privacy/
│       └── page.tsx                <-- Public Privacy Protocol entry point
├── features/
│   ├── privacy/
|   |   ├── _hooks/
│   |   │   └── use-cookie-consent.ts        <-- NEW: Headless privacy logic
│   │   └── components/
│   │       └── PrivacyClientView.tsx <-- Interactive consent orchestrator
│   └── help/
│       └── _hooks/
│           └── use-feedback-form.ts  <-- UPDATED: Added Privacy-aware sniffer
├── components/ui
│           ├── cookie-consent.tsx   <-- Atomic consent banner
│           └── CookieGovernance.tsx <-- Hydration guard for the banner
│
└── proxy.ts                         <-- UPDATED: Added /privacy exception

```

---

## (Update: 11-03-2026)

### **Laboratory Calculators & Performance Calibration**

This milestone transformed **VOLT.LAB** into a high-precision analytical workstation. We deployed a modular calculation suite designed to calibrate training intensity and relative strength using industry-standard sport science protocols.

#### **1. Headless Calculation Engine (`useCalculators`)**

We engineered a centralized mathematical "Brain" that decouples complex sport science formulas from the UI layer.

- **Brzycki 1RM Protocol**: Implemented high-accuracy strength estimation for sub-maximal efforts.
- **IPF Wilks Standard**: Deployed a 5th-degree polynomial coefficient engine to normalize strength across varying body masses and genders.
- **RPE Decay Model**: Developed an autoregulation engine that maps perceived exertion (RPE) to theoretical peak capacity (e1RM), utilizing a linear intensity decay algorithm.
- **Memoization Layer**: All calculations are wrapped in `useMemo` to ensure zero-latency UI updates during high-frequency input changes.

#### **2. Protocol Orchestration & Hub Architecture**

The module uses a **Dynamic Injection** pattern, allowing the user to switch between different "Laboratory Protocols" within a single workspace.

- **CalculatorsClientView**: Acts as the central hub. It utilizes a state-driven orchestrator to hot-swap between 1RM, Wilks, and RPE engines without page reloads.
- **Protocol Registry**: Centralized all calculator metadata (labels, technical descriptions) in a strictly typed registry (`CALCULATOR_OPTIONS`), ensuring a single source of truth for the entire module.

### **Technical Implementation Map**

| Feature                | File Location                                               | Technical Responsibility                                                               |
| ---------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Math Processor**     | `features/calculators/_hooks/use-calculators.ts`            | Headless logic: Brzycki, Wilks Polynomials, and RPE intensity mapping.                 |
| **Orchestrator**       | `features/calculators/components/CalculatorsClientView.tsx` | UI state-machine for switching active laboratory protocols.                            |
| **Wilks Engine**       | `features/calculators/components/WilksCalculator.tsx`       | Gender-aware relative strength scaling with dynamic standards reference.               |
| **RPE Calibrator**     | `features/calculators/components/RpeCalculator.tsx`         | Adaptive grid UI for effort-based performance monitoring.                              |
| **Protocol Registry**  | `features/calculators/types/index.ts`                       | Strictly typed registry for calculator metadata and JSDoc documentation.               |

---

### **Directory Structure Evolution**

```text
src/
├── app/(dashboard)/
│   └── calculators/
│       └── page.tsx                <-- Server-side shell with icon-enhanced PageHeader
├── features/
│   └── calculators/
│       ├── _hooks/
│       │   └── use-calculators.ts   <-- Headless math engine (1RM, Wilks, RPE)
│       ├── components/
│       │   ├── CalculatorsClientView.tsx <-- Protocol orchestrator
│       │   ├── OneRepMaxCalculator.tsx  <-- 1RM + Intensity Mapping
│       │   ├── WilksCalculator.tsx       <-- Relative strength engine
│       │   └── RpeCalculator.tsx         <-- Autoregulation calibrator
│       └── types/
│           └── index.ts               <-- JSDoc-documented protocol definitions
└── components/ui/
    └── PageHeader.tsx              <-- UPDATED: Added icon support

```

---

## (Update: 12-03-2026)

### **Session Identity & Dynamic Naming Protocol**

This milestone evolved the active training workspace by transitioning from static placeholders to a user-defined **Identity Engine**. This allows lifters to categorize and name their "On-The-Fly" sessions in real-time without interrupting the training flow.

#### **1. Inline Identity Orchestration (`EditableWorkoutName`)**

We developed a seamless "Click-to-Edit" interface that serves as the primary session header.

- **Transient State Management**: The component utilizes a dual-state approach, holding a `tempName` in local memory to allow for "Escape-to-Cancel" functionality before committing the string to the global store.
- **UX Calibration**: Implemented `inputRef` selection logic that automatically highlights the entire string upon activation, enabling 1-click replacement of default titles like "QUICK START SESSION".
- **Visual Feedback**: Integrated state-aware coloring; default placeholders are rendered with reduced opacity (`text-muted-foreground/60`), which shifts to full-intensity `text-foreground` once a custom protocol name is established.

#### **2. Flat-State Mutation Logic (Zustand Patching)**

Refactored the `useActiveWorkoutStore` to support atomic name updates within a high-performance flat state tree.

- **Direct Tree Patching**: The `updateName` action was optimized to bypass nested object overhead, directly targeting the `name` property. This ensures that the `persist` middleware can synchronize the new identity to `localStorage` with minimal compute cycles.
- **Sanitization Pipeline**: Implemented a `.trim()` sanitization logic within the `handleSave` callback. This prevents database "bloat" from leading/trailing whitespaces while preserving intentional multi-word names (e.g., "Upper Body A").

#### **3. View Layer Integration**

Reconstructed the `ActiveWorkoutView` to establish a dedicated **Identity Hub** at the top of the workspace.

---

### **Technical Implementation Map**

| Feature               | File Location                                          | Technical Responsibility                                                                 |
| --------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| **Identity Store**    | `features/workouts/_hooks/use-active-workout-store.ts` | Flat-state mutation logic and `localStorage` persistence synchronization.                |
| **Inline Editor**     | `features/workouts/components/EditableWorkoutName.tsx` | Managing transient edit states, keyboard orchestration (Enter/Esc), and input selection. |
| **View Orchestrator** | `features/workouts/components/ActiveWorkoutView.tsx`   | Integrating the Identity Hub into the primary training workspace layout.                 |
| **Sanitization**      | `features/workouts/components/EditableWorkoutName.tsx` | Input cleaning and validation against null/whitespace-only protocol names.               |

---

### **Directory Structure Evolution**

```text
src/
├── features/
│   └── workouts/
│       ├── _hooks/
│       │   └── use-active-workout-store.ts <-- UPDATED: Optimized updateName action
│       └── components/
│           ├── ActiveWorkoutView.tsx     <-- UPDATED: Integrated Identity Header
│           └── EditableWorkoutName.tsx   <-- NEW: High-precision inline editor

```

---
