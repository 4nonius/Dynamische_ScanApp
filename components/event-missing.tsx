import Link from "next/link";
import { CalendarX } from "lucide-react";

// Used INSIDE a valid route when the id in the URL has no matching event
export function EventMissing() {
    return (
        <div className="mx-auto w-full max-w-3xl px-6 py-16">
            <div className="rounded-2xl border border-dashed bg-white/70 p-10 text-center shadow-sm">
                <div className="mx-auto mb-4 w-fit rounded-full bg-indigo-50 p-3">
                    <CalendarX className="h-6 w-6 text-indigo-600" />
                </div>

                <h2 className="text-xl font-semibold">Event not found</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    This event was deleted, or it lives in a different browser. Data is
                    stored locally on this device.
                </p>

                <Link
                    href="/events"
                    className="mt-6 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                >
                    Back to my events
                </Link>
            </div>
        </div>
    );
}