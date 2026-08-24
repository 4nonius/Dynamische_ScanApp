"use client";

import { useState } from "react";
import type { SubmitEvent } from "react";
import { useParams } from "next/navigation";
import { FileText, Plus, Trash2 } from "lucide-react";

import { useEvents } from "@/lib/event-context";
import { EventMissing } from "@/components/event-missing";
import type { NoteSeverity } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";


const SEVERITY_STYLES: Record<NoteSeverity, string> = {
    info: "bg-sky-50 text-sky-700 border-sky-200",
    issue: "bg-amber-50 text-amber-700 border-amber-200",
    critical: "bg-red-50 text-red-700 border-red-200",
};

const SEVERITY_LABELS: Record<NoteSeverity, string> = {
    info: "Info",
    issue: "Issue",
    critical: "Critical",
};

const ALL_SEVERITIES: NoteSeverity[] = ["info", "issue", "critical"];

export default function NotesPage() {
    // 1. ALL hooks first.
    const { id } = useParams<{ id: string }>();
    const { events, notes, addNote, deleteNote, isLoaded } = useEvents();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [severity, setSeverity] = useState<NoteSeverity>("info");

    const event = events.find((e) => e.id === id);

    // 2. Guards, after every hook has run.
    if (!isLoaded) return null;
    if (!event) return <EventMissing />;

    // 3. Derived. addNote already prepends, so this list is newest-first.
    const mine = notes.filter((n) => n.eventId === id);

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!title.trim()) return;
        addNote(id, title.trim(), description.trim(), severity);
        setTitle("");
        setDescription("");
        setSeverity("info");
    };

    return (
        <div className="mx-auto w-full max-w-3xl px-6 py-16">
            <header className="mb-8">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
                    Notes
                </p>
                <h1 className="text-4xl font-bold tracking-tight">Incident log</h1>
                <p className="mt-2 text-muted-foreground">
                    Anything worth remembering, newest first.
                </p>
            </header>

            <form
                onSubmit={handleSubmit}
                className="mb-8 flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm"
            >
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What is it about? (e.g. Scanner #3)"
                    maxLength={60}
                    className="h-10"
                />

                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What happened?"
                    rows={3}
                    maxLength={300}
                    className="w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                />

                <div className="flex items-center gap-2">
                    <select
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value as NoteSeverity)}
                        aria-label="Severity"
                        className="h-10 rounded-lg border border-input bg-transparent px-3 text-sm outline-none"
                    >
                        {ALL_SEVERITIES.map((option) => (
                            <option key={option} value={option}>
                                {SEVERITY_LABELS[option]}
                            </option>
                        ))}
                    </select>

                    <Button type="submit" size="lg" className="ml-auto h-10 gap-1.5">
                        <Plus className="size-4" />
                        Add note
                    </Button>
                </div>
            </form>

            {mine.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-white/60 px-6 py-16 text-center">
                    <div className="rounded-full bg-indigo-50 p-3">
                        <FileText className="size-6 text-indigo-600" />
                    </div>
                    <p className="font-semibold">Nothing logged yet</p>
                    <p className="max-w-xs text-sm text-muted-foreground">
                        Notes you add during the event show up here with a timestamp.
                    </p>
                </div>
            ) : (
                <ul className="flex flex-col gap-3">
                    {mine.map((note) => (
                        <li
                            key={note.id}
                            className="group rounded-xl border bg-white p-4 shadow-sm transition-colors hover:border-indigo-300"
                        >
                            <div className="mb-1 flex items-center gap-3">
                                <span className="text-sm text-muted-foreground">
                                    {note.time}
                                </span>
                                <span
                                    className={cn(
                                        "rounded-full border px-2.5 py-0.5 text-xs font-medium",
                                        SEVERITY_STYLES[note.severity]
                                    )}
                                >
                                    {SEVERITY_LABELS[note.severity]}
                                </span>

                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    className="ml-auto text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                                    onClick={() => deleteNote(note.id)}
                                    aria-label={`Delete ${note.title}`}
                                >
                                    <Trash2 />
                                </Button>
                            </div>

                            <p className="font-semibold">{note.title}</p>

                            {/* && instead of a ternary: render nothing when there
                                is no description, rather than an empty paragraph. */}
                            {note.description && (
                                <p className="mt-1 text-sm whitespace-pre-line text-muted-foreground">
                                    {note.description}
                                </p>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}