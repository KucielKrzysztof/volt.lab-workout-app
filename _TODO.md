## TODO Roadmap

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

- [1/2] Interactive Help Center

- [ ] "Volt.Lab Manual": Comprehensive guide on the training lifecycle (Blueprint creation > Live Session > KPI Analytics).
- [x] FAQ (Knowledge Base): Detailed answers to technical and training-related questions.

- [x] Feedback & Bug Reporting Engine.

- [x] Integrated Report Form: Dedicated interface for submitting Bug Reports or Feature Requests directly to the database.
- [x] System Metadata Auto-capture: Automatically attach environment info (Browser, Theme, etc..) to reports for faster debugging.

- [ ] Laboratory Integrity & Status

- [x] Offline indicator - for users to know when they are offline.
- [ ] "Lab Notes" (Changelog): A user-facing version of the \_DOCS.md to keep users informed about the latest updates and new features.

### Privacy and Security

- [x] COOKIES consent.
- [ ] Terms of Service (TOS).

## TODO IN FAR FUTURE

- **Offline Requirement**: Keep in mind the **Service Worker** and **PowerSync** integration for the workout logging flow to prevent data loss in low-connectivity environments.

---
