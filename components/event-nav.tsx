"use client"

import {useParams, usePathname} from "next/navigation";
import {useEvents} from "@/lib/event-context";
import Link from "next/link";
import { cn } from "@/lib/utils";





export function EventNav() {
    const {id} = useParams<{ id: string }>();
    const pathname = usePathname();
    const {events, isLoaded} = useEvents();
    const links = [
        { href: `/events/${id}`, label: "Overview" },
        { href: `/events/${id}/scanners`, label: "Scanners" },
        { href: `/events/${id}/checklist`, label: "Checklist" },
        { href: `/events/${id}/notes`, label: "Notes" },
        { href: `/events/${id}/import`, label: "Imports" }
    ];

    if (!id) return null;
    const event = events.find((e) => e.id === id);
    const eventName = !isLoaded ? "": event? event.name : "Unknown event";

    return (
        <header className="p-5 border-gray-100 sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
            <nav className="flex gap-4 border-b border-gray-200 bg-gray-50 px-4 py-2">
                <Link href="/events" className="shrink-0 text-sm text-muted-foreground hover:text-foreground">
                    <span className="max-w-48 truncate font-semibold" title={eventName}>{eventName}</span>
                </Link>

                {links.map((link) => (
                    <Link key={link.href} href={link.href} className={cn(
                        "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                        pathname === link.href
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}>
                        {link.label}
                    </Link>
                ))}
            </nav>
        </header>
    );
}


