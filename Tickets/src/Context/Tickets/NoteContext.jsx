import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { createNote, getNotes } from '../../services/ticketsService';
import TicketContext from "./TicketContext";
import useAlert from '../../Components/Hooks/useAlert';
const NoteContext = createContext();

const NoteProvider = ({ children }) => {

    const {projectID, ticketID} = useContext(TicketContext);
    const { openAlert } = useAlert();
    const [formNotes, setFormNotes] = useState({ note: '' });
    const [notes, setNotes] = useState([]);
    const [loadingNotes, setLoadingNotes] = useState(false);
    const [errorNotes, setErrorNotes] = useState('');

    const loadNotes = useCallback(async () => {
        if (!projectID || !ticketID) return;

        setLoadingNotes(true);
        setErrorNotes('');

        try{
            const response = await getNotes(projectID, ticketID);
            if (Array.isArray(response)) {
                setNotes(response);
                return;
            }
            setErrorNotes('Invalid notes response');
        }catch(err){
            const message = err instanceof Error ? err.message : 'Failed to load notes';
            setErrorNotes(message);
        }finally{
            setLoadingNotes(false);
        }
    }, [projectID, ticketID]);

    useEffect(() => {
        loadNotes();
    }, [loadNotes])

    const submitNote = async () => {
        setErrorNotes('');
        if (!formNotes.note.trim()) {
            const message = 'Note content is required';
            setErrorNotes(message);
            return { ok: false, message };
        }
        if (!ticketID){
            const message = 'Ticket ID is required';
            setErrorNotes(message);
            return { ok: false, message };
        }
        setLoadingNotes(true);

        try{
            await createNote(formNotes, projectID, ticketID);
            const response = await getNotes(projectID, ticketID);
            setNotes(response);
            setFormNotes({ note: '' });
            return { ok: true, data: response };
        }catch(err){

            const message = err instanceof Error ? err.message : 'Failed to create note';
            setErrorNotes(message);
            openAlert();
            return { ok: false, message };
        }finally{
            setLoadingNotes(false);
        }
    }

    const resetNotes = () => {
        setFormNotes({ note: '' });
        setLoadingNotes(false);
        setErrorNotes('');
    }
    const data = { 
        setFormNotes, submitNote, 
        formNotes, notes,
        loadingNotes, errorNotes,
        resetNotes
    };
    return <NoteContext.Provider value={data}>{children}</NoteContext.Provider>;
}

export {NoteProvider}
export default NoteContext;