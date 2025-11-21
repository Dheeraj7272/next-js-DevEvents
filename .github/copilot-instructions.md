## Quick overview
- This is a Next.js (app router) TypeScript project. UI lives in `app/` and reusable UI lives in `components/`.
- Server-side data is stored in MongoDB using Mongoose. Models are in `database/` and the connection helper is `lib/mongodb.ts`.

## Primary patterns an AI should follow
- Use the app-router conventions: put server code (API route handlers) under `app/api/**/route.ts` and UI pages under `app/**` (not `pages/`).
- Always call the shared DB connector before running Mongoose operations. See `lib/mongodb.ts` (connectDB) — it caches the Mongoose connection in `global.mongoose` to avoid duplicate connections during dev hot-reloads.
- Models follow the `models.X || model<X>('X', Schema)` pattern. Prefer importing `Event` from `database/event.model.ts` rather than re-defining schemas inline.

## Data model & validation notes (important)
- Events: `database/event.model.ts` contains pre-save hooks that (a) generate `slug`, (b) normalize `date` to `YYYY-MM-DD`, and (c) normalize `time` to `HH:MM`. If you add/modify fields, make sure normalization logic is updated and preserved.
- Bookings: `database/booking.model.ts` validates that `eventId` references an existing Event in a pre-save hook and enforces a unique index on `{ eventId, email }`.

## Environment & scripts
- The DB connection expects `MONGODB_URI` (see `lib/mongodb.ts`). Add it to `.env.local` for local development.
- Useful npm scripts (root `package.json`): `dev` (next dev), `build` (next build), `start` and `lint`.

## Component & styling conventions
- UI uses Tailwind and `app/globals.css`. Components live in `components/` and use Next.js primitives (e.g., `next/image`, `next/link`). Example: `components/EventCard.tsx` uses `Link` to `/events/<slug>`.
- Utility helpers follow small, focused files under `lib/` (e.g., `lib/utils.ts` exposes `cn()` for class merging).

## API route guidance
- Routes are file-based under `app/api`. Follow the existing `route.ts` pattern: import `connectDB()`, call it once at the top of the handler, then use model methods (e.g., `Event.find()`, `Event.create()`).
- Return standard JSON responses and consistent status codes. Keep errors descriptive but not overly verbose.

## Examples (where to look)
- DB connect: `lib/mongodb.ts` — caching pattern and error behavior.
- Main models: `database/event.model.ts`, `database/booking.model.ts` — pre-save hooks and indexes.
- API route example: `app/api/events/route.ts` (see how requests are handled and DB is used).
- Component example: `components/EventCard.tsx` (Next Image + Link usage).

## Things to avoid / be careful about
- Don’t create a new Mongoose connection per request — always use `connectDB()` and rely on the cached connection.
- When changing validation/normalization logic in models, consider migration impacts (existing documents rely on slugs/dates/time formats).
- For any server changes requiring secrets, use env vars (do not hardcode keys or URIs into source files).

## If you make code changes
- Run `npm run dev` for local testing. If you modify TS types or interfaces, run a typecheck or build: `npm run build`.
- Prefer small, focused PRs that update models and API handlers together if the API surface changes.

---
If anything here is unclear or you want me to include more examples (small code snippets or a PR checklist), tell me which area to expand and I’ll update this file.
