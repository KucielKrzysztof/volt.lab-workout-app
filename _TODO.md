## 📝 VOLT.LAB - Updated TODO Roadmap

### Workouts Module (Active Training & History)

_Goal: Allow users to log their physical activity and browse past sessions._

- [x] **Workout History List**
- [x] Implement **Infinite Scroll** or **Pagination** using TanStack Query `useInfiniteQuery`.
- [x] Data Source: Supabase `workouts` table.
- [x] Features: Filter by date range, summary cards (volume, duration, etc...).

- [x] **New Workout Flow**
- [x] Integration with **Workout Templates** (e.g., Push, Pull, Leg Day).
- [x] **Auto-population logic**: Selecting a template automatically fills the current date and the predefined list of exercises.

- [x] **Set Tracking**
- [x] Input fields for **Weight (kg)** and **Reps** for each set.
- [x] **Persistence**: Save session to Supabase upon completion.

---

### More / Settings & Management

_Goal: System configuration and template engine._

- [x] **Workout Templates Manager**
- [x]Interface to create, edit, and delete personal training routines.
- **Routine Builder**:
- [x] Search and select exercises from the global `exercises` library.
- [x] Define **Default Series Count** for each exercise within the template.
- [ ] Drag-and-drop ordering of exercises (UI refinement).

- [ ] **Account & Profile**
- [x] Manage display name and profile picture (Supabase Storage integration).
- [ ] Privacy settings and data export options.

- [ ] **System Preferences**
- [ ] Toggle between Metric (kg) and Imperial (lbs) units.
- [x] Toggle between dark and light UI mode.

---

### Support & User Education (Help & Feedback)

_Goal: Ensure laboratory operational stability and user guidance._

- [ ] Interactive Help Center

- [ ] "Volt.Lab Manual": Comprehensive guide on the training lifecycle (Blueprint creation > Live Session > KPI Analytics).
- [x] FAQ (Knowledge Base): Detailed answers to technical and training-related questions.

- [ ] Feedback & Bug Reporting Engine.

- [ ] Integrated Report Form: Dedicated interface for submitting Bug Reports or Feature Requests directly to the database.
- [ ] System Metadata Auto-capture: Automatically attach environment info (Browser, Theme, etc..) to reports for faster debugging.

- [ ] Laboratory Integrity & Status

- [ ] System Status Dashboard: Real-time visualization of connection health (Supabase API status, Edge Functions).
- [ ] "Lab Notes" (Changelog): A user-facing version of the \_DOCS.md to keep users informed about the latest updates and new features.

## TODO IN FAR FUTURE

- **Offline Requirement**: Keep in mind the **Service Worker** and **PowerSync** integration for the workout logging flow to prevent data loss in low-connectivity environments (gym basements).

---
