"use client"

import {EventMissing} from "@/components/event-missing";
import {useParams} from "next/navigation";
import {useEvents} from "@/lib/event-context";

export default function EventOverviewPage() {
    // 1. ALL hooks first
    const { id } = useParams<{ id: string }>();
    const { events, scanners, checklist, notes, isLoaded } = useEvents();

    const event = events.find((e) => e.id === id);

    // 2. Guards: every hook has run above, so returning early is safe here.
    if (!isLoaded) return null;           // still reading localStorage
    if (!event) return <EventMissing />;  // valid route, no such event

    // 3. Derived values
    const myScanners = scanners.filter((s) => s.eventId === id);
    return (
        <main className="mx-auto w-full max-w-5xl px-6 py-16">
            <h1 className="text-4xl font-bold tracking-tight">Overview Page</h1>
        </main>
    );
}