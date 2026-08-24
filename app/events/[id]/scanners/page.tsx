"use client";

import { useState } from "react";
import type { SubmitEvent } from "react";
import { useParams } from "next/navigation";
import { Plus, ScanLine, Search, Trash2 } from "lucide-react";

import { useEvents } from "@/lib/event-context";
import { EventMissing } from "@/components/event-missing";
import type { ScannerStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<ScannerStatus, string> = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    idle: "bg-amber-50 text-amber-700 border-amber-200",
    broken: "bg-red-50 text-red-700 border-red-200",
};

const STATUS_LABELS: Record<ScannerStatus, string> = {
    active: "Active",
    idle: "Idle",
    broken: "Broken",
};

const ALL_STATUSES: ScannerStatus[] = ["active", "idle", "broken"];

export default function ScannersPage() {
    // 1. ALL hooks first.
    const { id } = useParams<{ id: string }>();
    const {
        events,
        scanners,
        addScanner,
        updateScannerStatus,
        deleteScanner,
        isLoaded,
    } = useEvents();

    const [label, setLabel] = useState("");
    const [operator, setOperator] = useState("");
    const [search, setSearch] = useState("");

    const event = events.find((e) => e.id === id);

    // 2. Guards, after every hook has run.
    if (!isLoaded) return null;
    if (!event) return <EventMissing />;

    // 3. Derived values.
    const mine = scanners.filter((s) => s.eventId === id);

    // Search: recalculated on every keystroke, because setSearch triggers
    const visible = mine.filter(
        (s) =>
            s.label.toLowerCase().includes(search.toLowerCase()) ||
            (s.operator ?? "").toLowerCase().includes(search.toLowerCase())
    );

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!label.trim()) return;
        addScanner(id, label.trim(), operator.trim());
        setLabel("");
        setOperator("");
    };

    return (
        <div className="mx-auto w-full max-w-5xl px-6 py-16">
            <header className="mb-8">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
                    Scanners
                </p>
                <h1 className="text-4xl font-bold tracking-tight">Entrance scanners</h1>
                <p className="mt-2 text-muted-foreground">
                    Who is scanning where, and is their device working.
                </p>
            </header>

            <form
                onSubmit={handleSubmit}
                className="mb-6 flex flex-col gap-2 rounded-xl border bg-white p-3 shadow-sm sm:flex-row"
            >
                <Input
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="Location (e.g. North entrance)"
                    maxLength={40}
                    className="h-10 border-0 shadow-none focus-visible:ring-0"
                />
                <Input
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                    placeholder="Operator name"
                    maxLength={40}
                    className="h-10 border-0 shadow-none focus-visible:ring-0"
                />
                <Button type="submit" size="lg" className="h-10 shrink-0 gap-1.5">
                    <Plus className="size-4" />
                    Add scanner
                </Button>
            </form>

            {/* Search box only makes sense once there is something to search. */}
            {mine.length > 0 && (
                <div className="relative mb-6">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by location or operator"
                        className="h-10 pl-9"
                    />
                </div>
            )}

            {/* Three states: nothing added yet / nothing matches the search / the list. */}
            {mine.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-white/60 px-6 py-16 text-center">
                    <div className="rounded-full bg-indigo-50 p-3">
                        <ScanLine className="size-6 text-indigo-600" />
                    </div>
                    <p className="font-semibold">No scanners yet</p>
                    <p className="max-w-xs text-sm text-muted-foreground">
                        Add a scanner for each entrance you need to staff.
                    </p>
                </div>
            ) : visible.length === 0 ? (
                <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
                    No scanner matches &quot;{search}&quot;.
                </p>
            ) : (
                <ul className="flex flex-col gap-2">
                    {visible.map((scanner, index) => (
                        <li
                            key={scanner.id}
                            className="group flex flex-wrap items-center gap-4 rounded-xl border bg-white p-4 shadow-sm transition-colors hover:border-indigo-300"
                        >
              <span className="w-8 shrink-0 text-sm font-medium text-muted-foreground">
                #{index + 1}
              </span>

                            <div className="min-w-40 flex-1">
                                <p className="truncate font-semibold">{scanner.label}</p>
                                <p className="truncate text-sm text-muted-foreground">
                                    {scanner.operator || "Unassigned"}
                                </p>
                            </div>

                            <span
                                className={cn(
                                    "rounded-full border px-3 py-1 text-xs font-medium",
                                    STATUS_STYLES[scanner.status]
                                )}
                            >
                {STATUS_LABELS[scanner.status]}
              </span>

                            <select
                                value={scanner.status}
                                onChange={(e) =>
                                    updateScannerStatus(
                                        scanner.id,
                                        e.target.value as ScannerStatus
                                    )
                                }
                                aria-label={`Change status of ${scanner.label}`}
                                className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring"
                            >
                                {ALL_STATUSES.map((status) => (
                                    <option key={status} value={status}>
                                        {STATUS_LABELS[status]}
                                    </option>
                                ))}
                            </select>

                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                                onClick={() => deleteScanner(scanner.id)}
                                aria-label={`Delete ${scanner.label}`}
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