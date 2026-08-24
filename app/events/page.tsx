"use client";

import { useState } from "react";
import type { SubmitEvent } from "react";
import Link from "next/link";
import { CalendarDays, ChevronRight, Plus, Trash2 } from "lucide-react";

import { useEvents } from "@/lib/event-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EventsPage() {
    const { events, addEvent, deleteEvent } = useEvents();
    const [name, setName] = useState("");

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name.trim()) return;
        addEvent(name.trim());
        setName("");
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-indigo-50 via-white to-white">
            <div className="mx-auto w-full max-w-3xl px-6 py-16">
                <header className="mb-10">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
                        Eventim
                    </p>
                    <h1 className="text-4xl font-bold tracking-tight">My events</h1>
                    <p className="mt-2 text-muted-foreground">
                        Pick an event to manage, or create a new one.
                    </p>
                </header>

                <form
                    onSubmit={handleSubmit}
                    className="mb-10 flex gap-2 rounded-xl border bg-white p-3 shadow-sm"
                >
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name of the event"
                        maxLength={50}
                        className="h-10 border-0 shadow-none focus-visible:ring-0"
                    />
                    <Button type="submit" size="lg" className="h-10 shrink-0 gap-1.5">
                        <Plus className="size-4" />
                        Add event
                    </Button>
                </form>

                {events.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-white/60 px-6 py-16 text-center">
                        <div className="rounded-full bg-indigo-50 p-3">
                            <CalendarDays className="size-6 text-indigo-600" />
                        </div>
                        <p className="font-semibold">No events yet</p>
                        <p className="max-w-xs text-sm text-muted-foreground">
                            Create your first event to start tracking scanners, notes and your
                            checklist.
                        </p>
                    </div>
                ) : (
                    <>
                        <h2 className="mb-3 text-sm font-medium text-muted-foreground">
                            {events.length} {events.length === 1 ? "event" : "events"}
                        </h2>

                        <ul className="flex flex-col gap-3">
                            {events.map((event) => (
                                <li
                                    key={event.id}
                                    className="group flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
                                >
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-sm font-bold text-indigo-600">
                                        {event.name.charAt(0).toUpperCase()}
                                    </div>

                                    <Link href={`/events/${event.id}`} className="min-w-0 flex-1">
                                        <span className="block font-semibold" title={event.name}>{event.name}</span>
                                        <span className="block text-sm text-muted-foreground">Open dashboard</span>
                                    </Link>

                                    <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                                        onClick={() => deleteEvent(event.id)}
                                        aria-label={`Delete ${event.name}`}
                                    >
                                        <Trash2 />
                                    </Button>

                                    <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
}