import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { TicketsContextType } from "../types";
import { useTicketList } from "../hooks/useTicketList";
import { useTicketNotes } from "../hooks/useTicketNotes";
import { useParams } from "react-router";

const TicketContext = createContext<TicketsContextType | undefined>(undefined);

export const TicketProvider = ({ children }: { children: ReactNode }) => {
  const { id: projectID } = useParams<{ id: string }>();
  const [ticketID, setTicketID] = useState<string | null>(null);

  const { submitTicket, editTicket, deleteTickets, changeState, loadingStateChange,
    listTickets, isPendingTicket, isErrorTicket, errorTicket } = useTicketList(projectID);
  const { notes, isPending, isError, error } = useTicketNotes(projectID, ticketID);

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
    submitTicket,
    editTicket,
    deleteTickets,
    changeState,
    loadingStateChange,
  } as unknown as TicketsContextType
  ), [
    projectID, ticketID, setTicketID,
    notes, isPending, isError, error,
    listTickets, defineTicket,
    isPendingTicket, isErrorTicket, errorTicket,
    submitTicket, editTicket, deleteTickets, changeState, loadingStateChange,
  ])
  return <TicketContext.Provider value={data}>{children}</TicketContext.Provider>;
};

export const useTickets = (): TicketsContextType => {
  const ctx = useContext(TicketContext);
  if (!ctx) throw new Error("useTickets must be used within TicketProvider");
  return ctx;
};
