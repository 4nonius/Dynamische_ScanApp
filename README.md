# Event App

An event-day operations dashboard. Not a ticketing site and not an RSVP planner —
this is the tool the crew opens **on the day itself**: which entrance scanners are
running, what still has to be done before doors open, and what went wrong at 21:14.

Live: https://dynamische-eindproject.vercel.app

---

## What it does

| Page | Route | Purpose |
|---|---|---|
| Start | `/` | Landing page |
| Event list | `/events` | Create, open or delete an event |
| Overview | `/events/[id]` | Dashboard: live counts for every part of the event |
| Scanners | `/events/[id]/scanners` | Entrance scanners, operators, status, search |
| Checklist | `/events/[id]/checklist` | Tasks before doors open, with a progress bar |
| Notes | `/events/[id]/notes` | Timestamped incident log, newest first |
| Details | `/events/[id]/details` | Date, location, expected visitors, contact |

Everything hangs off an event. Delete the event and its scanners, tasks and notes
go with it.

---

## Tech

- **Next.js 16** (App Router) with Turbopack
- **React 19** — `useState`, `useEffect`, `useContext`, custom hooks
- **TypeScript** — union types, `Partial<T>`, `Record<Union, string>`
- **Tailwind CSS v4** + **shadcn/ui** (built on Base UI)
- **localStorage** for persistence

---

## Running it

```bash
npm install
npm run dev
```

Open http://localhost:3000

---

## How it is built

### Routing is the folder structure

There is no router configuration anywhere. `app/events/[id]/scanners/page.tsx`
*is* the route `/events/<some-id>/scanners`. The `[id]` folder is a dynamic
segment; the value from the URL arrives through `useParams()`.

`app/events/[id]/layout.tsx` wraps every page beneath it, which is why the event
navbar appears inside an event and nowhere else — no conditional rendering
required.

### One state layer

`lib/event-context.tsx` holds all four collections and every function that
changes them. Pages never own shared data; they read it through the custom
`useEvents()` hook and call back into the context to change it.

State is **flat**, one array per entity, each row carrying an `eventId`:

```
events[]     id, name, date?, location?, expectedVisitors?, contactName?, contactPhone?
scanners[]   id, eventId, label, operator?, status
checklist[]  id, eventId, title, done
notes[]      id, eventId, time, title, description, severity
```

Filtering with `.filter(x => x.eventId === id)` is the same operation as
`WHERE event_id = ?`, and `deleteEvent` filters all four arrays — the manual
version of `ON DELETE CASCADE`. The shape maps 1:1 onto SQL tables, which is
what makes a future database migration a rewrite of one file instead of the
whole app.

### Derived values are never stored

The checklist progress bar, the scanner counts and the search results are all
recalculated from the source arrays on every render. Nothing is cached in state,
so no two numbers on screen can ever disagree with each other.

### Persistence

Two effects in the context: one reads `localStorage` on mount, one writes on
every change. Reading has to happen in an effect because `window` does not exist
while the page renders on the server. An `isLoaded` flag stops the write effect
from overwriting saved data with an empty array on the very first render.

---

## Known limitations

- **Data is per browser.** localStorage is not a server. Open the app on another
  device and it starts empty. Supabase is the intended next step; the context is
  the only layer that would change.
- **The checkbox is a `<button>`, not `<input type="checkbox">`.** Styling won
  over semantics — a screen reader announces "button" instead of the checked
  state. The correct fix is a native checkbox with a styled label.
- **No tests.** Given the deadline, the time went into features that could be
  demonstrated and explained.

---

## Project structure

```
app/
  layout.tsx                    root layout, wraps everything in EventProvider
  page.tsx                      start page
  not-found.tsx                 404 for unmatched routes
  events/
    page.tsx                    event list
    [id]/
      layout.tsx                event shell + navbar
      page.tsx                  overview dashboard
      scanners/page.tsx
      checklist/page.tsx
      notes/page.tsx
      details/page.tsx
components/
  event-nav.tsx                 navbar, highlights the active route
  event-missing.tsx             shown when the id has no matching event
  ui/                           shadcn components
lib/
  event-context.tsx             all state and all mutations
  types.ts                      the domain model
  utils.ts                      cn() class merger
```

---

Built for **Dynamische Webapps**, Thomas More.
