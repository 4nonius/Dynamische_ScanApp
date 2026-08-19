"use client";

import {createContext, useContext, useEffect, useState} from "react";
import type {ReactNode} from "react";
import type {Event} from "@/lib/types";

type EventContextValue = {
    events: Event[];
    addEvent: (name: string) => void;
    deleteEvent: (id: string) => void;
};

const EventContext= createContext<EventContextValue | null>(null);


export function EventProvider({ children } : {children: ReactNode}) {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    //opladen info
    useEffect(() => {
    const raw = localStorage.getItem("events");
    if (raw){
        try{
            setEvents(JSON.parse(raw) as Event[]);
        } catch{
            //corrupted data, geeft een lege blad ipv crash
        }
    }
    setIsLoaded(true);
    }, []);

// opslaan info
    useEffect(() => {
    if(!isLoaded) return;
    localStorage.setItem('events', JSON.stringify(events));
}, [events, isLoaded]);

//toevoegen event
    const addEvent = (name: string) => {
        const newEvent: Event = {id: crypto.randomUUID(), name};
        setEvents([...events, newEvent]);
    };


//verwijderen event
    const deleteEvent = (id: string) => {
        setEvents(events.filter(event => event.id !== id));
    };

return (
    <EventContext.Provider value={{events, addEvent, deleteEvent}}>
        {children}
    </EventContext.Provider>
);
}

export function useEvents(){
    const ctx = useContext(EventContext);
    if (!ctx) throw new Error("useEvents must be used inside <EventProvider>");
    return ctx;

}
