import { createContext, useCallback, useState } from "react";
import { getTicketProject } from '../../services/ticketsService';
const TicketContext = createContext();

const TicketProvider = ({ children }) => {
    const [projectID, setProjectID] = useState('');
    const [ticketID, setTicketID] = useState(null);
    const [listTickets, setListTickets] = useState([]);
    const [loadingTickets, setLoadingTickets] = useState(false);
    const [errorTickets, setErrorTickets] = useState('');
    const [exitMessage, setExitMessage] = useState('');

    const defineTicket = (id) => {
        setTicketID(id || null);
    }

    const loadTickets = useCallback(async (projectID) => {
        if (!projectID) return;

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
    }, [setLoadingTickets, setErrorTickets, setListTickets]);

    const data = { 
        projectID, setProjectID, 
        ticketID, listTickets, setListTickets, defineTicket, 
        loadingTickets, errorTickets, loadTickets,
        exitMessage, setExitMessage
    };
    return <TicketContext.Provider value={data}>{children}</TicketContext.Provider>;
}

export {TicketProvider}
export default TicketContext;