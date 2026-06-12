import React, { createContext, useCallback, useState, type ReactNode } from "react";
import { getTicketProject } from '../../services/ticketsService';

export type TicketItem = { [key: string]: any };

export type TicketContextType = {
  projectID: string;
  setProjectID: React.Dispatch<React.SetStateAction<string>>;
  ticketID: string | null;
  setTicketID: React.Dispatch<React.SetStateAction<string | null>>;
  listTickets: TicketItem[];
  setListTickets: React.Dispatch<React.SetStateAction<TicketItem[]>>;
  defineTicket: (id: string | null) => void;
  loadingTickets: boolean;
  errorTickets: string;
  loadTickets: (projectID: string) => Promise<{ ok: boolean; data?: any; message?: string }>;
  exitMessage: string;
  setExitMessage: React.Dispatch<React.SetStateAction<string>>;
};

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const TicketProvider = ({ children }: { children: ReactNode }) => {
  const [projectID, setProjectID] = useState<string>('');
  const [ticketID, setTicketID] = useState<string | null>(null);
  const [listTickets, setListTickets] = useState<TicketItem[]>([]);
  const [loadingTickets, setLoadingTickets] = useState<boolean>(false);
  const [errorTickets, setErrorTickets] = useState<string>('');
  const [exitMessage, setExitMessage] = useState<string>('');

  const defineTicket = (id: string | null) => {
    setTicketID(id || null);
  };

  const loadTickets = useCallback(async (projectID: string) => {
    if (!projectID) return { ok: false, message: 'Project ID required' };

    setLoadingTickets(true);
    setErrorTickets('');

    try {
      const response = await getTicketProject(projectID);
      const tickets = response?.tickets;

      if (Array.isArray(tickets)) {
        setListTickets(tickets);
        return { ok: true, data: tickets };
      }

      const message = 'Invalid tickets response';
      setErrorTickets(message);
      return { ok: false, message };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load tickets';
      setErrorTickets(message);
      return { ok: false, message };
    } finally {
      setLoadingTickets(false);
    }
  }, []);

  const data: TicketContextType = {
    projectID,
    setProjectID,
    ticketID,
    setTicketID,
    listTickets,
    setListTickets,
    defineTicket,
    loadingTickets,
    errorTickets,
    loadTickets,
    exitMessage,
    setExitMessage,
  };

  return <TicketContext.Provider value={data}>{children}</TicketContext.Provider>;
};

export const useTicketContext = (): TicketContextType => {
  const ctx = React.useContext(TicketContext);
  if (!ctx) throw new Error('useTicketContext must be used within TicketProvider');
  return ctx;
};

export default TicketContext;
