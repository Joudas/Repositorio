import { createNote, getNotes } from "@/services/ticketsService";
import { useState } from "react";
import { useAlert } from "@/Hooks/useAlerts";
import type { NoteContextType, NoteForm, NoteItem } from "../types";
import { useQuery,useMutation } from '@tanstack/react-query'
import { useQueryClient } from "@/Hooks/useQuery";

// Accept projectID and ticketID as parameters to avoid consuming TicketContext
export function useTicketNotes(projectID?: string | null, ticketID?: string | null, onSuccess?: () => void): NoteContextType {
    const { openAlert } = useAlert();
    const queryClient = useQueryClient();

    const [formNotes, setFormNotes] = useState<NoteForm>({ note: '' });

    const {mutate: submitNote} = useMutation({
        mutationFn: () => createNote(formNotes, projectID, ticketID), //formNotes, projectID!, ticketID!
        onSuccess: (response) => {
            setFormNotes(response);
            queryClient.invalidateQueries({ 
                queryKey: ['listNotes', String(projectID), String(ticketID)],
                exact: true 
            });
            onSuccess?.();
        },
        onError: () => openAlert()
    });

    const {data:notes = [], isPending, isError, error}  = useQuery<NoteItem[]>({ 
        queryKey: ['listNotes',  String(projectID), String(ticketID)], 
        queryFn: () => getNotes(projectID, ticketID),
        enabled: !!projectID && !!ticketID,
    });

    const resetNotes = () => {
        setFormNotes({ note: '' });
    };

  return {
    notes,
    error,
    isError, 
    isPending, 
    formNotes,
    submitNote,
    resetNotes,
    setFormNotes,
  };
}
