# VOLT.LAB

**VOLT.LAB** is a high-performance training workstation designed for athletes who demand precision and reliability. Focusing on high-speed UX and Low-Connection reliability, and workout analytics.

## 🛠 Tech Stack

- **Framework:** Next.js 16 (App Router) with Turbopack.
- **Database:** Supabase (PostgreSQL).
- **State Management:** TanStack Query v5 & Zustand (Persistent via localStorage).
- **Styling:** Tailwind CSS 4 + Shadcn UI + Cookie-based Theme Synchronization.
- **Alerts:** Sonner (Toast notifications)
- **Icons:** Lucide React
- **Security:** Proxy-based Auth Guarding, PKCE flow, and PostgreSQL triggers for identity sync.

## Key Features

- **Routine Blueprint Architect**: Create custom training routines by selecting from a global library of 400+ exercises. Features a high-performance relational persistence layer for managing personal templates and exercise mappings.
- **Active Training Workspace**: Real-time session tracking with Zustand persistence to prevent data loss during refreshes.
- **Yearly Achievement Architecture**: Track Personal Records (PRs) partitioned by year to monitor seasonal progression.
- **Activity Snapshot Engine**: High-performance heatmap (Activity Grid) with 100% data accuracy for yearly workout sessions tracking.
- **SSR Theme Engine**: Zero-flash (FOUC) theme synchronization using a cookie-based SSR architecture.
- **Relational Workout History**: Deep-join architecture retrieving full session snapshots in a single database round-trip.
- **Support & Knowledge Base**: Integrated FAQ, user manuals, and a dedicated Feedback & Bug Reporting system to report system anomalies and help calibrate the app environment.

## Core Architecture

The project operates on the **Supabase Trinity** (Server, Client, and Middleware/Proxy clients) to ensure consistent data flow across the Next.js lifecycle. All performance analytics, such as Total Volume, are calculated using atomic relational mapping:

$$\sum (\text{weight} \times \text{reps})$$

Large tonnages are automatically normalized into tons for better readability .

## 🌐 Visit Live on Vercel

The App is deployed and fully operational on the Vercel Platform.

> **[Open VOLT.LAB Command Center →](https://volt-lab-app.vercel.app)**

---
