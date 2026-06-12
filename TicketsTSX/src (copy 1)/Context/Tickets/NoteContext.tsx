import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { createNote, getNotes } from '../../services/ticketsService';
import TicketContext, { TicketContextType } from "./TicketContext";
import useAlert from '../../Components/Hooks/useAlert';

export type NoteItem = { [key: string]: any };
export type NoteForm = { note: string };

export type NoteContextType = {
  formNotes: NoteForm;
  setFormNotes: React.Dispatch<React.SetStateAction<NoteForm>>;
  notes: NoteItem[];
  loadingNotes: boolean;
  errorNotes: string;
  submitNote: () => Promise<{ ok: boolean; data?: any; message?: string }>;
  resetNotes: () => void;
};

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const NoteProvider = ({ children }: { children: ReactNode }) => {
  const { projectID, ticketID } = useContext<TicketContextType | undefined>(TicketContext) || {};
  const { openAlert } = useAlert();
  const [formNotes, setFormNotes] = useState<NoteForm>({ note: '' });
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [loadingNotes, setLoadingNotes] = useState<boolean>(false);
  const [errorNotes, setErrorNotes] = useState<string>('');

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
  }, [loadNotes]);

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
      await createNote(formNotes, projectID!, ticketID!);
      const response = await getNotes(projectID!, ticketID!);
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
  };

  const resetNotes = () => {
    setFormNotes({ note: '' });
    setLoadingNotes(false);
    setErrorNotes('');
  };

  const data: NoteContextType = {
    setFormNotes,
    submitNote,
    formNotes,
    notes,
    loadingNotes,
    errorNotes,
    resetNotes,
  };
  return <NoteContext.Provider value={data}>{children}</NoteContext.Provider>;
};

export const useNoteContext = (): NoteContextType => {
  const ctx = React.useContext(NoteContext);
  if (!ctx) throw new Error('useNoteContext must be used within NoteProvider');
  return ctx;
};

export default NoteContext;
