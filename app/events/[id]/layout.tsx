import type {ReactNode} from "react";
import {EventNav} from "@/components/event-nav";

export default function EventLayout({children}: { children: ReactNode }) {
    return (<div className="min-h-screen bg-linear-to-b from-indigo-50 via-white to-white">
            <EventNav/>
            {children}
        </div>

    )
}