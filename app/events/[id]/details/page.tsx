"use client";

import { useState } from "react";
import type { ChangeEvent, SubmitEvent } from "react";
import { useParams } from "next/navigation";
import { Check } from "lucide-react";

import { useEvents } from "@/lib/event-context";
import { EventMissing } from "@/components/event-missing";
import type { Event } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DetailsPage() {
    // 1. ALL hooks first.
    const { id } = useParams<{ id: string }>();
    const { events, isLoaded } = useEvents();

    const event = events.find((e) => e.id === id);

    // 2. Guards, after every hook has run.
    if (!isLoaded) return null;
    if (!event) return <EventMissing />;

    return (
        <div className="mx-auto w-full max-w-3xl px-6 py-16">
            <header className="mb-8">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
                    Details
                </p>
                <h1 className="text-4xl font-bold tracking-tight">Event sheet</h1>
                <p className="mt-2 text-muted-foreground">
                    The practical information the team needs on the day.
                </p>
            </header>

            {/* key={event.id} remounts the form when you switch events, so its
                useState re-seeds from the new event instead of keeping the old. */}
            <EventDetailsForm key={event.id} event={event} />
        </div>
    );
}

// A child component with its own typed props. It receives the event and
// reports back by calling updateEvent - the state itself stays in the context.
type EventDetailsFormProps = {
    event: Event;
};

function EventDetailsForm({ event }: EventDetailsFormProps) {
    const { updateEvent } = useEvents();
    const [saved, setSaved] = useState(false);

    // Seeded from props on mount. Inputs always hold strings, so numbers are
    // converted here and converted back on submit.
    const [form, setForm] = useState({
        date: event.date ?? "",
        location: event.location ?? "",
        expectedVisitors: event.expectedVisitors?.toString() ?? "",
        scannersNeeded: event.scannersNeeded?.toString() ?? "",
        contactName: event.contactName ?? "",
        contactPhone: event.contactPhone ?? "",
    });

    // One handler for every field: the input's name matches the state key.
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setSaved(false);
    };

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Partial<Event>: I only send the fields I am changing, and empty
        // inputs become undefined so the overview shows a dash, not "".
        updateEvent(event.id, {
            date: form.date || undefined,
            location: form.location.trim() || undefined,
            expectedVisitors: form.expectedVisitors
                ? Number(form.expectedVisitors)
                : undefined,
            scannersNeeded: form.scannersNeeded
                ? Number(form.scannersNeeded)
                : undefined,
            contactName: form.contactName.trim() || undefined,
            contactPhone: form.contactPhone.trim() || undefined,
        });
        setSaved(true);
    };

    const fields = [
        { name: "date", label: "Date", type: "date", placeholder: "" },
        {
            name: "location",
            label: "Location",
            type: "text",
            placeholder: "Sportpaleis",
        },
        {
            name: "expectedVisitors",
            label: "Expected visitors",
            type: "number",
            placeholder: "4000",
        },
        {
            name: "scannersNeeded",
            label: "Scanners needed",
            type: "number",
            placeholder: "6",
        },
        {
            name: "contactName",
            label: "Contact name",
            type: "text",
            placeholder: "Jan Peeters",
        },
        {
            name: "contactPhone",
            label: "Contact phone",
            type: "tel",
            placeholder: "+32 470 00 00 00",
        },
    ] as const;

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-xl border bg-white p-5 shadow-sm"
        >
            <h2 className="mb-1 text-lg font-semibold">Event details</h2>
            <p className="mb-5 text-sm text-muted-foreground">
                These values fill the cards on the overview page.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
                {fields.map((field) => (
                    <label key={field.name} className="flex flex-col gap-1.5">
                        <span className="text-sm font-medium">{field.label}</span>
                        <Input
                            name={field.name}
                            type={field.type}
                            value={form[field.name]}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                            min={field.type === "number" ? 0 : undefined}
                            className="h-10"
                        />
                    </label>
                ))}
            </div>

            <div className="mt-5 flex items-center gap-3">
                <Button type="submit" size="lg" className="h-10">
                    Save details
                </Button>
                {saved && (
                    <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                        <Check className="size-4" />
                        Saved
                    </span>
                )}
            </div>
        </form>
    );
}