import type { UseMutateFunction } from "@tanstack/react-query";

export interface TicketItem {
  id: string;
  name: string;
  description: string;
  state: string;
  priority: string;
  project_id?: string;
  created_at?: string;
  createDate?: string;
  createdAt?: string;
}

export interface NoteItem {
  id: string;
  note: string;
  created_at: string;
  author_id?: string;
}

export type TicketForm = {
    name: string;
    description: string;
    state: string;
    priority: string;
};

export type NoteForm = { note: string };

export type NoteContextType = {
    formNotes: NoteForm;
    setFormNotes: React.Dispatch<React.SetStateAction<NoteForm>>;
    notes: NoteItem[];
    isPending: boolean;
    isError: boolean;
    error: Error | null;
    submitNote: UseMutateFunction<void, Error, void, unknown>;
    resetNotes: () => void;
};

export type TicketsContextType = {
    projectID: string;
    setProjectID: React.Dispatch<React.SetStateAction<string>>;
    ticketID: string | null;
    setTicketID: React.Dispatch<React.SetStateAction<string | null>>;
    listTickets: TicketItem[];
    setListTickets: React.Dispatch<React.SetStateAction<TicketItem[]>>;
    loadTickets: (projectID: string) => Promise<{ ok: boolean; data?: TicketItem[]; message?: string }>;
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
    isError: boolean;
    error: Error | null;
    submitNote: () => Promise<{ ok: boolean; data?: NoteItem; message?: string }>;
    resetNotes: () => void;

    /* Ticket form/actions */
    loadingForm: boolean;
    loadingSubmitEdit: boolean;
    loadingStateChange: boolean;
    errorForm: string | null;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    submitTicket: UseMutateFunction<TicketItem, Error, TicketForm, unknown>;
    editTicket: (id: string) => void;
    deleteTickets: (id: string) => void;
    loadTicketUpdate: (ticket: TicketItem) => void;
    resetForm: () => void;
    form: TicketForm;
    changeState: UseMutateFunction<TicketItem, Error, {
        state: string;
        ticketID: string;
    }, unknown>;
    setForm: React.Dispatch<React.SetStateAction<TicketForm>>;
};

export type priorityType = {
    state: string;
    css: string;
    color: string;
};
export type stateType = {
    state: string;
    label: string;
    next: string;
    css: string;
    border: string;
};
export type TicketDetailProps = {
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
    openModal: (modal: string, payload?: unknown) => void;
    actualTicket: TicketItem | null;
    stateTicket: stateType;
};

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
    defineTicket: (id: string | null) => void;
    isPending: boolean;
    openModal: (modal: string, payload?: unknown) => void;
};
