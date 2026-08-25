export type ScannerStatus =  'active' | 'idle' | 'broken';
export type NoteSeverity = 'info' | 'critical' | 'issue';

//Informatie over mijn events
export type Event = {
    id: string;
    name: string;
    date?: string;
    location?: string;
    expectedVisitors?: number;
    contactName?: string;
    contactPhone?: string;
};

//informatie over mijn scanners
export type Scanner = {
    id: string;
    eventId: string;
    label: string;
    operator?: string;
    status: ScannerStatus;
}


//voor mijn notas
export type EventNote = {
    id: string;
    eventId: string;
    time: string;
    title: string;
    description: string;
    severity: NoteSeverity;
}

// todo voor mijn checklist
export type ChecklistItem = {
    id: string;
    eventId: string;
    title: string;
    done: boolean;
}


