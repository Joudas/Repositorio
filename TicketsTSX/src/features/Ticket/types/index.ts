import type { UseMutateFunction } from "@tanstack/react-query";

export type TicketItem = { [key: string]: any };

export type NoteItem = { [key: string]: any };

export type NoteForm = { note: string };

export type NoteContextType = {
    formNotes: NoteForm;
    setFormNotes: React.Dispatch<React.SetStateAction<NoteForm>>;
    notes: NoteItem[];
    isPending: boolean;
    isError: boolean;
    error: Error | null;
    submitNote: UseMutateFunction<any, Error, void, unknown>
    resetNotes: () => void;
};

export type TicketForm = {
    name: string;
    description: string;
    state: string;
    priority: string;
};

export type TicketsContextType = {
    projectID: string;
    setProjectID: React.Dispatch<React.SetStateAction<string>>;
    ticketID: string | null;
    setTicketID: React.Dispatch<React.SetStateAction<string | null>>;
    listTickets: TicketItem[];
    setListTickets: React.Dispatch<React.SetStateAction<TicketItem[]>>;
    loadTickets: (projectID: string) => Promise<{ ok: boolean; data?: any; message?: string }>;
    isPendingTicket: boolean;
    errorTickets: string;
    defineTicket: (id: string | null) => void;
    exitMessage: string;
    setExitMessage: React.Dispatch<React.SetStateAction<string>>;

    /* Notes */
    formNotes: NoteForm;
    setFormNotes: React.Dispatch<React.SetStateAction<NoteForm>>;
    notes: NoteItem[];
    isPending: boolean;
    isError: boolean
    error: Error | null;
    submitNote: () => Promise<{ ok: boolean; data?: any; message?: string }>;
    resetNotes: () => void;

    /* Ticket form/actions */
    loadingForm: boolean;
    loadingStateChange: boolean;
    errorForm: string | null;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    submitTicket: UseMutateFunction<any, Error, TicketForm, unknown>;
    editTicket: (id: string) => Promise<{ ok: boolean; data?: any; message?: string }>;
    deleteTickets: (id: string) => Promise<{ ok: boolean; data?: any; message?: string }>;
    resetForm: () => void;
    form: TicketForm;
    changeState: UseMutateFunction<any, Error, {
        state: string;
        ticketID: string;
    }, unknown>;
    setForm: React.Dispatch<React.SetStateAction<TicketForm>>;
};


export type priorityType = {
    state: string;
    css: string;
    color: string;
}
export type stateType = {
    state: string;
    label: string;
    next: string;
    css: string;
    border: string;
}
export type TicketDetailProps = {
    priorityMap: {
        low: priorityType;
        medium: priorityType;
        high: priorityType;
    }
    statesMap: {
        completed: stateType;
        in_progress: stateType;
        pending: stateType;
    }
    openModal: (modal: any, payload?: null) => void
    actualTicket: TicketItem
    stateTicket: any
}

export type TicketListType = {
    priorityMap: {
        low: priorityType;
        medium: priorityType;
        high: priorityType;
    };
    statesMap: {
        completed: stateType;
        in_progress: stateType;
        pending: stateType;
    };
    listTickets: TicketItem[];
    actualTicket: TicketItem | null;
    defineTicket: any;
    isPending: boolean;
    openModal: (modal: any, payload?: null) => void
}