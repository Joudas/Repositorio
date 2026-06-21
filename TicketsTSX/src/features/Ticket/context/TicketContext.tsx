<<<<<<< Updated upstream
import { createContext, useContext, useState, type ReactNode } from "react";
=======
import { createContext, useContext, useEffect, useState, useCallback, useMemo, type ReactNode } from "react";
>>>>>>> Stashed changes
import type { TicketsContextType } from "../types";
import { useTicketList } from "../hooks/useTicketList";
import { useTicketNotes } from "../hooks/useTicketNotes";
import { useParams } from "react-router";

const TicketContext = createContext<TicketsContextType | undefined>(undefined);

export const TicketProvider = ({ children }: { children: ReactNode }) => {
  const { id: projectID } = useParams<{ id: string }>();
  const [ticketID, setTicketID] = useState<string | null>(null);

<<<<<<< Updated upstream
  const { submitTicket, editTicket, deleteTickets, changeState, loadingStateChange,
    listTickets, isPendingTicket, isErrorTicket, errorTicket } = useTicketList(projectID);
  const { notes, isPending, isError, error } = useTicketNotes(projectID, ticketID);
=======
    
  const { submitTicket, submitTicketAsync, editTicket, deleteTickets, form, changeState, handleChange, resetForm,
    listTickets, isPendingTicket, isErrorTicket, errorTicket, loadingSubmit } = useTicketList();
  const {notes, isPending, isError, error} = useTicketNotes(ticketID);
>>>>>>> Stashed changes

  const defineTicket = useCallback((id: string | null) => {
    setTicketID(id || null);
  }, []);

  const data = useMemo(() => ({
    projectID,
    ticketID,
    setTicketID,

    notes,
    isPending,
    isError,
    error,

    listTickets,
    defineTicket,
    isPendingTicket,
    isErrorTicket,
    errorTicket,
<<<<<<< Updated upstream
    submitTicket,
    editTicket,
    deleteTickets,
    changeState,
    loadingStateChange,
  } as unknown as TicketsContextType;
=======
    handleChange,
    submitTicket,
    submitTicketAsync,
    loadingSubmit,
    editTicket,
    deleteTickets,
    changeState,
    resetForm,
    form,
  } as unknown as TicketsContextType), [projectID, ticketID, notes, isPending, isError, error, listTickets, defineTicket, isPendingTicket, isErrorTicket, errorTicket, handleChange, submitTicket, editTicket, deleteTickets, changeState, resetForm, form]);
>>>>>>> Stashed changes

  return <TicketContext.Provider value={data}>{children}</TicketContext.Provider>;
};

export const useTickets = (): TicketsContextType => {
  const ctx = useContext(TicketContext);
  if (!ctx) throw new Error("useTickets must be used within TicketProvider");
  return ctx;
};

export default TicketContext;
