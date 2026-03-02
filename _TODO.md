## 📝 VOLT.LAB - Updated TODO Roadmap

### Workouts Module (Active Training & History)

_Goal: Allow users to log their physical activity and browse past sessions._

- [x] **Workout History List**
- [ ] Implement **Infinite Scroll** or **Pagination** using TanStack Query `useInfiniteQuery`.
- [x] Data Source: Supabase `workouts` table.
- [x] Features: Filter by date range, summary cards (volume, duration, etc...).

- [x] **New Workout Flow**
- [x] Integration with **Workout Templates** (e.g., Push, Pull, Leg Day).
- [x] **Auto-population logic**: Selecting a template automatically fills the current date and the predefined list of exercises.

- [x] **Set Tracking**
- Input fields for **Weight (kg)** and **Reps** for each set.
- [x] **Persistence**: Save session to Supabase upon completion.

---

### More / Settings & Management

_Goal: System configuration and template engine._

- [x] **Workout Templates Manager**
- [ ]Interface to create, edit, and delete personal training routines.
- **Routine Builder**:
- [x] Search and select exercises from the global `exercises` library.
- [x] Define **Default Series Count** for each exercise within the template.
- [ ] Drag-and-drop ordering of exercises (UI refinement).

- [ ] **Account & Profile**
- [x] Manage display name and profile picture (Supabase Storage integration).
- [ ] Privacy settings and data export options.

- [ ] **System Preferences**
- [ ] Toggle between Metric (kg) and Imperial (lbs) units.
- [ ] Toggle between dark and light UI mode.

---

### 🛠 Technical Implementation Notes (For Future Reference)

## ⚡ VOLT.LAB Database Schema Specification

This schema is designed with a normalized relational structure to ensure high-performance queries and flexible data persistence.

### 👤 1. Profiles & Identity

The `profiles` table extends the core Auth metadata with application-specific user information.

| Column                 | Type          | Description                                                                                                |
| ---------------------- | ------------- | ---------------------------------------------------------------------------------------------------------- |
| **`id`**               | `uuid` (PK)   | Primary Key; directly linked to `auth.users.id` [cite: 21-02-2026].                                        |
| **`display_name`**     | `text`        | Public user handle (optional).                                                                             |
| **`avatar_url`**       | `text`        | Path to the file within the `avatars` storage bucket.                                                      |
| **`personal_records`** | **`jsonb`**   | **Crucial**: Stores an array of objects (e.g., `[{"exercise_id": "uuid", "weight": 100, "date": "..."}]`). |
| **`updated_at`**       | `timestamptz` | Automatic timestamp for profile modifications.                                                             |

### 🏋️ 2. Exercise Library

The `exercises` table acts as the static knowledge base for all movements in the system.

- **`id`** (`uuid`): Unique identifier generated via `gen_random_uuid()`.
- **`name`** (`text`): The full name of the exercise (e.g., "Bench Press (Barbell)").
- **`muscle_group`** (`text`): The primary muscle group targeted (e.g., "Chest", "Back").
- **`created_at`** (`timestamptz`): Entry timestamp for the global library.

### 📝 3. Workouts (Sessions)

The `workouts` table serves as the "Session Header" for training activity.

- **`user_id`** (`uuid`): Foreign Key (FK) to the profile; used for user-specific history filtering.
- **`duration_seconds`** (`int`): Total session time calculated upon completion.
- **`total_volume`** (`numeric`): Aggregated tonnage (Weight Repetitions) for the entire session.
- **`status`** (`text`): Session state; accepts `'in_progress'` (default) or `'completed'`.
- **`started_at`** & **`completed_at`**: High-precision session timestamps (`timestamptz`).

### 📊 4. Workout Sets (Performance Data)

This is where the granular performance analytics are stored.

| Column            | Type        | Description                                                              |
| ----------------- | ----------- | ------------------------------------------------------------------------ |
| **`workout_id`**  | `uuid` (FK) | Reference to the parent session in the `workouts` table.                 |
| **`exercise_id`** | `uuid` (FK) | Reference to the specific exercise in the library.                       |
| **`weight`**      | `numeric`   | Load used. `numeric` type allows for fractional weights (e.g., 12.5 kg). |
| **`reps`**        | `int`       | Number of successful repetitions.                                        |
| **`set_order`**   | `int`       | Chronological order of the set within the specific exercise .            |

### 📜 5. Routines & Blueprints (Templates)

A dual-table structure used for creating repeatable training routines.

#### **`workout_templates` Table**

- **`name`**: Title of the routine (e.g., "Push Day A").
- **`description`**: Optional context or goals for the routine.

#### **`template_exercises` Table**

- **`suggested_sets`**: Default set count (default: 3).
- **`suggested_reps`**: Default rep target (default: 10).
- **`order`**: Exercise sequence within the routine.
- **`notes`**: Technical cues or specific instructions for that exercise in the template.

---

## TODO IN FAR FUTURE

- **Offline Requirement**: Keep in mind the **Service Worker** and **PowerSync** integration for the workout logging flow to prevent data loss in low-connectivity environments (gym basements).

---
