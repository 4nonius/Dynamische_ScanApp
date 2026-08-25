import Link from 'next/link';
import {buttonVariants} from "@/components/ui/button";
import {cn} from "@/lib/utils";



  export default function Home() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-8 bg-indigo-700 px-6 text-center text-white">
          <h1 className="text-6xl font-bold tracking-tight">EVENTIM</h1>

          <p className="max-w-md text-lg text-indigo-100">
           Everything for the event on the same day: Scanners, notes and checklist in one place!
          </p>

            <Link
                href="/events"
                className={cn(buttonVariants({ size: "lg" }), "h-11 bg-white px-8 text-base text-indigo-700 hover:bg-indigo-50")}
            >Events</Link>
        </div>
    );
  }