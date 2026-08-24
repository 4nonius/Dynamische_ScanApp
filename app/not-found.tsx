import Link from "next/link";
import { SearchX } from "lucide-react";

// whenever a URL does not match any route in the app/ folder.
export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-indigo-50 via-white to-white px-6">
            <div className="w-full max-w-md rounded-2xl border border-dashed bg-white/70 p-10 text-center shadow-sm">
                <div className="mx-auto mb-4 w-fit rounded-full bg-indigo-50 p-3">
                    <SearchX className="h-6 w-6 text-indigo-600" />
                </div>

                <h1 className="text-2xl font-bold tracking-tight">Page not found</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    This link points to something that does not exist (anymore).
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