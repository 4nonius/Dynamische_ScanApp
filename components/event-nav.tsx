"use client"

import {useParams, usePathname} from "next/navigation";
import {useEvents} from "@/lib/event-context";
import Link from "next/link";

const {id} = useParams<{ id: string }>();
const pathname = usePathname();
const events = useEvents();


export function EventNav() {
    if (!id) return null;
    const event = events.events.find(event => event.id === id);
    if (!event) return null;

    return (
        <nav className="flex gap-4 border-b border-gray-200 bg-gray-50 px-4 py-2">
            <li>
            <Link href={`/events/${id}`} className="text-indigo-700 hover:text-indigo-900"> Overview</Link>
            <Link href={`/events/${id}/import`} className="text-indigo-700 hover:text-indigo-900"> Imports</Link>
            <Link href={`/events/${id}/checklist`} className="text-indigo-700 hover:text-indigo-900"> Checklist</Link>
            <Link href={`/events/${id}/scanners`} className="text-indigo-700 hover:text-indigo-900"> Scanners</Link>
            <Link href={`/events/${id}/notes`} className="text-indigo-700 hover:text-indigo-900"> Notes</Link>
            </li>
        </nav>
    );
}


