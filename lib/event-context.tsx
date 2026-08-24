"use client";

import {createContext, useContext, useEffect, useState} from "react";
import type {ReactNode} from "react";
import type {
    ChecklistItem,
    Event,
    EventNote,
    NoteSeverity,
    Scanner,
    ScannerStatus
} from "@/lib/types";

const STORAGE_KEY = "eventim-state";

type StoredState = {
    events: Event[];
    scanners: Scanner[];
    checklist: ChecklistItem[];
    notes: EventNote[];
};

type EventContextValue = {
    isLoaded: boolean;

    events: Event[];
    addEvent: (name: string) => void;
    deleteEvent: (id: string) => void;
    updateEvent: (id: string, changes: Partial<Event>) => void;

    scanners: Scanner[];
    addScanner: (eventId: string, label: string, operator: string) => void;
    updateScannerStatus: (id: string, status: ScannerStatus) => void;
    deleteScanner: (id: string) => void;

    checklist: ChecklistItem[];
    addChecklistItem: (eventId: string, title: string) => void;
    toggleChecklistItem: (id: string) => void;
    deleteChecklistItem: (id: string) => void;

    notes: EventNote[];
    addNote: (eventId: string, title: string, description: string, severity: NoteSeverity) => void;
    deleteNote: (id: string) => void;
};

const EventContext = createContext<EventContextValue | null>(null);


export function EventProvider({children}: { children: ReactNode }) {
    const [events, setEvents] = useState<Event[]>([]);
    const [scanners, setScanners] = useState<Scanner[]>([]);
    const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
    const [notes, setNotes] = useState<EventNote[]>([]);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    //opladen info
    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            try {
                const saved = JSON.parse(raw) as StoredState;
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setEvents(saved.events ?? []);
                setScanners(saved.scanners ?? []);
                setChecklist(saved.checklist ?? []);
                setNotes(saved.notes ?? []);
            } catch {
                //gives empty page when something goes wrong like data corruption.
            }
        }
        setIsLoaded(true);
    }, []);

    // opslaan info
    useEffect(() => {
        if (!isLoaded) return;
        const state: StoredState = {events, scanners, checklist, notes};
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [events, scanners, checklist, notes, isLoaded]);

    //toevoegen event
    const addEvent = (name: string) => {
        const newEvent: Event = {id: crypto.randomUUID(), name};
        setEvents([...events, newEvent]);
    };

    //verwijderen event + alles wat eraan hangt
    const deleteEvent = (id: string) => {
        setEvents(events.filter(e => e.id !== id));
        setScanners(scanners.filter(s => s.eventId !== id));
        setChecklist(checklist.filter(c => c.eventId !== id));
        setNotes(notes.filter(n => n.eventId !== id));
    };

    //event aanpassen (gebruikt door de import pagina)
    const updateEvent = (id: string, changes: Partial<Event>) => {
        setEvents(events.map(e => (e.id === id ? {...e, ...changes} : e)));
    };

    //scanners
    const addScanner = (eventId: string, label: string, operator: string) => {
        const newScanner: Scanner = {
            id: crypto.randomUUID(), eventId, label, operator, status: "active"
        };
        setScanners([...scanners, newScanner]);
    };

    const updateScannerStatus = (id: string, status: ScannerStatus) => {
        setScanners(scanners.map(s => (s.id === id ? {...s, status} : s)));
    };

    const deleteScanner = (id: string) => {
        setScanners(scanners.filter(s => s.id !== id));
    };

    //checklist
    const addChecklistItem = (eventId: string, title: string) => {
        const newItem: ChecklistItem = {id: crypto.randomUUID(), eventId, title, done: false};
        setChecklist([...checklist, newItem]);
    };

    const toggleChecklistItem = (id: string) => {
        setChecklist(checklist.map(c => (c.id === id ? {...c, done: !c.done} : c)));
    };

    const deleteChecklistItem = (id: string) => {
        setChecklist(checklist.filter(c => c.id !== id));
    };

    //notes
    const addNote = (eventId: string, title: string, description: string, severity: NoteSeverity) => {
        const time = new Date().toLocaleTimeString("nl-BE", {hour: "2-digit", minute: "2-digit"});
        const newNote: EventNote = {id: crypto.randomUUID(), eventId, time, title, description, severity};
        setNotes([newNote, ...notes]);
    };

    const deleteNote = (id: string) => {
        setNotes(notes.filter(n => n.id !== id));
    };

    return (
        <EventContext.Provider value={{
            isLoaded,
            events, addEvent, deleteEvent, updateEvent,
            scanners, addScanner, updateScannerStatus, deleteScanner,
            checklist, addChecklistItem, toggleChecklistItem, deleteChecklistItem,
            notes, addNote, deleteNote
        }}>
            {children}
        </EventContext.Provider>
    );
}

export function useEvents() {
    const ctx = useContext(EventContext);
    if (!ctx) throw new Error("useEvents must be used inside <EventProvider>");
    return ctx;
}