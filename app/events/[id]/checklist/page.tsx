"use client";

import { useState } from "react";
import type { SubmitEvent } from "react";
import { useParams } from "next/navigation";
import { Check, ClipboardCheck, Plus, Trash2 } from "lucide-react";

import { useEvents } from "@/lib/event-context";
import { EventMissing } from "@/components/event-missing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function ChecklistPage() {
    // 1. ALL hooks first.
    const { id } = useParams<{ id: string }>();
    const {
        events,
        checklist,
        addChecklistItem,
        toggleChecklistItem,
        deleteChecklistItem,
        isLoaded,
    } = useEvents();

    const [title, setTitle] = useState("");

    const event = events.find((e) => e.id === id);

    // 2. Guards, after every hook has run.
    if (!isLoaded) return null;
    if (!event) return <EventMissing />;

    // 3. Derived values: recalculated every render, never stored in state.
    const items = checklist.filter((c) => c.eventId === id);
    const doneCount = items.filter((c) => c.done).length;
    const percent = items.length === 0 ? 0 : (doneCount / items.length) * 100;

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!title.trim()) return;
        addChecklistItem(id, title.trim());
        setTitle("");
    };

    return (
        <div className="mx-auto w-full max-w-3xl px-6 py-16">
            <header className="mb-8">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
                    Checklist
                </p>
                <h1 className="text-4xl font-bold tracking-tight">Before doors open</h1>
                <p className="mt-2 text-muted-foreground">
                    Everything that has to be done before the event starts.
                </p>
            </header>

            {/* Progress bar. The width comes straight from the data, so it can
                never drift out of sync with the checkboxes below. */}
            {items.length > 0 && (
                <div className="mb-8 rounded-xl border bg-white p-5 shadow-sm">
                    <div className="mb-2 flex items-baseline justify-between">
                        <span className="font-medium">
                            {doneCount} / {items.length} completed
                        </span>
                        <span className="text-sm text-muted-foreground">
                            {Math.round(percent)}%
                        </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                            style={{ width: `${percent}%` }}
                        />
                    </div>
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="mb-8 flex gap-2 rounded-xl border bg-white p-3 shadow-sm"
            >
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Add a task"
                    maxLength={80}
                    className="h-10 border-0 shadow-none focus-visible:ring-0"
                />
                <Button type="submit" size="lg" className="h-10 shrink-0 gap-1.5">
                    <Plus className="size-4" />
                    Add task
                </Button>
            </form>

            {items.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-white/60 px-6 py-16 text-center">
                    <div className="rounded-full bg-indigo-50 p-3">
                        <ClipboardCheck className="size-6 text-indigo-600" />
                    </div>
                    <p className="font-semibold">No tasks yet</p>
                    <p className="max-w-xs text-sm text-muted-foreground">
                        Add the things your team needs to finish before doors open.
                    </p>
                </div>
            ) : (
                <ul className="flex flex-col gap-2">
                    {items.map((item) => (
                        <li
                            key={item.id}
                            className="group flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm transition-colors hover:border-indigo-300"
                        >
                            {/* Custom checkbox: a real button, so it is keyboard
                                focusable and screen readers announce the label. */}
                            <button
                                type="button"
                                onClick={() => toggleChecklistItem(item.id)}
                                aria-label={item.done ? "Mark as not done" : "Mark as done"}
                                className={cn(
                                    "flex size-6 shrink-0 items-center justify-center rounded-md border transition-colors",
                                    item.done
                                        ? "border-indigo-600 bg-indigo-600 text-white"
                                        : "border-input hover:border-indigo-400"
                                )}
                            >
                                {item.done && <Check className="size-4" />}
                            </button>

                            <span
                                className={cn(
                                    "min-w-0 flex-1 transition-colors",
                                    item.done && "text-muted-foreground line-through"
                                )}
                            >
                                {item.title}
                            </span>

                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                                onClick={() => deleteChecklistItem(item.id)}
                                aria-label={`Delete ${item.title}`}
                            >
                                <Trash2 />
                            </Button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}