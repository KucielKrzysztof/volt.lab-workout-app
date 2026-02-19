
## 📝 VOLT.LAB - Updated TODO Roadmap

###  Workouts Module (Active Training & History)

*Goal: Allow users to log their physical activity and browse past sessions.*

* [ ] **Workout History List**
* Implement **Infinite Scroll** or **Pagination** using TanStack Query `useInfiniteQuery`.
* Data Source: Supabase `workouts` table.
* Features: Filter by date range, summary cards (volume, duration, top lift).


* [ ] **New Workout Flow**
* Integration with **Workout Templates** (e.g., Push, Pull, Leg Day).
* **Auto-population logic**: Selecting a template automatically fills the current date and the predefined list of exercises.


* [ ] **Real-time Set Tracking**
* Input fields for **Weight (kg)** and **Reps** for each set.
* **Dynamic Sets**: Initialize with default series count from the template, but allow the user to add/remove "extra" sets on the fly.
* **Persistence**: Save session to Supabase upon completion.



---

### More / Settings & Management

*Goal: System configuration and template engine.*

* [ ] **Workout Templates Manager**
* Interface to create, edit, and delete personal training routines.
* **Routine Builder**:
* Search and select exercises from the global `exercises` library.
* Define **Default Series Count** for each exercise within the template.
* Drag-and-drop ordering of exercises (UI refinement).




* [ ] **Account & Profile**
* Manage display name and profile picture (Supabase Storage integration).
* Privacy settings and data export options.


* [ ] **System Preferences**
* Toggle between Metric (kg) and Imperial (lbs) units.
* Notification settings for workout reminders.



---

### 🛠 Technical Implementation Notes (For Future Reference)

* **Database Schema**:
* `workouts`: stores metadata (id, user_id, start_time, end_time, total_volume).
* `workout_sets`: stores specific performance (workout_id, exercise_id, weight, reps, set_order).
* `workout_templates`: stores routine blueprints.


* **Form Logic**: Consider using `react-hook-form` for the workout logging screen due to high frequency of input updates.
* **Offline Requirement**: Keep in mind the **Service Worker** and **PowerSync** integration for the workout logging flow to prevent data loss in low-connectivity environments (gym basements).

---
