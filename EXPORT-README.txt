eCompliance website source — 10 November 2026

Includes the latest phone layout, same-tab refresh restoration, and 30-minute inactivity sign-out.

Main website: public/portal.html
Audit screens: public/audit-workspace.js and public/audit-workspace.css
Phone layout: public/portal-mobile.css
Refresh and inactivity: public/portal-session.js and public/session-policy.js
Online storage: public/cloud.js
Database schema: drizzle/migrations/0000_migration.sql

Install dependencies with bun install, then run bun run dev.
The full project is required; opening portal.html directly is not a supported deployment.
For another host, configure the Cloud connection and authentication settings appropriately.

Accounts, saved answers and uploaded documents remain in Lovable Cloud; they are not included in this ZIP.
Private environment settings, repository metadata, dependencies and generated build output are excluded.
Publishing is separate from downloading these source files.
