"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
    CalendarDays,
    ClipboardCheck,
    FileText,
    MapPin,
    Phone,
    ScanLine,
    Users,
} from "lucide-react";

import { useEvents } from "@/lib/event-context";
import { EventMissing } from "@/components/event-missing";

export default function EventOverviewPage() {
    // 1. ALL hooks first.
    const { id } = useParams<{ id: string }>();
    const { events, scanners, checklist, notes, isLoaded } = useEvents();

    const event = events.find((e) => e.id === id);

    // 2. Guards, after every hook has run.
    if (!isLoaded) return null;
    if (!event) return <EventMissing />;

    // 3. Filter the flat state down to this event.
    const myScanners = scanners.filter((s) => s.eventId === id);
    const myChecklist = checklist.filter((c) => c.eventId === id);
    const myNotes = notes.filter((n) => n.eventId === id);

    // Derived values: recalculated every render, never stored in state.
    const activeCount = myScanners.filter((s) => s.status === "active").length;
    const brokenCount = myScanners.filter((s) => s.status === "broken").length;
    const doneCount = myChecklist.filter((c) => c.done).length;
    const criticalCount = myNotes.filter((n) => n.severity === "critical").length;
    const percent =
        myChecklist.length === 0 ? 0 : (doneCount / myChecklist.length) * 100;

    // Every field except name is optional in the Event type, so each one
    // falls back to a dash instead of printing "undefined".
    const details = [
        { icon: CalendarDays, label: "Date", value: event.date, sub: undefined },
        { icon: MapPin, label: "Location", value: event.location, sub: undefined },
        {
            icon: Users,
            label: "Expected visitors",
            value: event.expectedVisitors?.toString(),
            sub: undefined,
        },
        {
            icon: Phone,
            label: "Contact",
            value: event.contactName,
            sub: event.contactPhone, // second line under the name
        },
    ];

    return (
        <div className="mx-auto w-full max-w-5xl px-6 py-16">
            <header className="mb-10">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
                    Event dashboard
                </p>
                <h1 className="text-4xl font-bold tracking-tight">{event.name}</h1>
                <p className="mt-2 text-muted-foreground">
                    Everything happening on the day, in one place.
                </p>
            </header>

            {/* Event details */}
            <section className="mb-10 grid gap-3 sm:grid-cols-2">
                {details.map((detail) => (
                    <div
                        key={detail.label}
                        className="flex items-start gap-3 rounded-xl border bg-white p-4 shadow-sm"
                    >
                        <detail.icon className="mt-0.5 size-5 shrink-0 text-indigo-600" />
                        <div className="min-w-0">
                            <p className="text-xs text-muted-foreground">{detail.label}</p>
                            <p className="truncate font-medium">{detail.value || "—"}</p>
                            {detail.sub && (
                                <p className="truncate text-sm text-muted-foreground">
                                    {detail.sub}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </section>

            {/* Summary tiles. Every number below is derived from the same
                arrays the sub-pages render, so they can never disagree. */}
            <section className="grid gap-4 sm:grid-cols-3">
                <Link
                    href={`/events/${id}/scanners`}
                    className="rounded-xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
                >
                    <ScanLine className="mb-3 size-5 text-indigo-600" />
                    <p className="text-sm font-medium text-muted-foreground">Scanners</p>
                    <p className="mt-1 text-2xl font-bold">
                        {activeCount}
                        <span className="text-base font-normal text-muted-foreground">
                            {" / "}
                            {myScanners.length}
                        </span>
                    </p>
                    <p
                        className={
                            brokenCount > 0
                                ? "text-sm font-medium text-red-600"
                                : "text-sm text-muted-foreground"
                        }
                    >
                        {brokenCount > 0 ? `${brokenCount} broken` : "active right now"}
                    </p>
                </Link>

                <Link
                    href={`/events/${id}/checklist`}
                    className="rounded-xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
                >
                    <ClipboardCheck className="mb-3 size-5 text-indigo-600" />
                    <p className="text-sm font-medium text-muted-foreground">Checklist</p>
                    <p className="mt-1 text-2xl font-bold">
                        {doneCount}
                        <span className="text-base font-normal text-muted-foreground">
                            {" / "}
                            {myChecklist.length}
                        </span>
                    </p>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                            style={{ width: `${percent}%` }}
                        />
                    </div>
                </Link>

                <Link
                    href={`/events/${id}/notes`}
                    className="rounded-xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
                >
                    <FileText className="mb-3 size-5 text-indigo-600" />
                    <p className="text-sm font-medium text-muted-foreground">Notes</p>
                    <p className="mt-1 text-2xl font-bold">{myNotes.length}</p>
                    <p
                        className={
                            criticalCount > 0
                                ? "text-sm font-medium text-red-600"
                                : "text-sm text-muted-foreground"
                        }
                    >
                        {criticalCount > 0 ? `${criticalCount} critical` : "logged incidents"}
                    </p>
                </Link>
            </section>

            {/* Latest activity: slice(0, 3) because addNote prepends,
                so the first three are already the three newest. */}
            {myNotes.length > 0 && (
                <section className="mt-10">
                    <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
                        Latest notes
                    </h2>
                    <ul className="flex flex-col gap-2">
                        {myNotes.slice(0, 3).map((note) => (
                            <li
                                key={note.id}
                                className="flex items-center gap-3 rounded-xl border bg-white px-4 py-3 text-sm shadow-sm"
                            >
                                <span className="shrink-0 text-muted-foreground">
                                    {note.time}
                                </span>
                                <span className="min-w-0 flex-1 truncate font-medium">
                                    {note.title}
                                </span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}