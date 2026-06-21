import { createNote, getNotes } from "@/services/ticketsService";
import { useState } from "react";
import type { NoteContextType, NoteForm, NoteItem } from "../types";
import { useQuery, useMutation } from '@tanstack/react-query'
import { useQueryClient } from "@/Hooks/useQuery";
<<<<<<< Updated upstream
import { useAlertStore } from "@/Store/alertStore";

// Accept projectID and ticketID as parameters to avoid consuming TicketContext
export function useTicketNotes(projectID?: string | null, ticketID?: string | null, onSuccess?: () => void): NoteContextType {
=======
import { useAlertStore } from "@/Store/useAlertStore";
import { useParams } from "react-router";

// Accept projectID and ticketID as parameters to avoid consuming TicketContext
export function useTicketNotes(ticketID?: string | null, onSuccess?: () => void): NoteContextType {
    
    const { id: projectID } = useParams<{ id: string }>();
>>>>>>> Stashed changes
    const { openAlert } = useAlertStore();
    const queryClient = useQueryClient();

    const [formNotes, setFormNotes] = useState<NoteForm>({ note: '' });

    const { mutate: submitNote } = useMutation({
        mutationFn: () => createNote(formNotes, projectID, ticketID), //formNotes, projectID!, ticketID!
        onSuccess: (response) => {
            setFormNotes(response);
            queryClient.invalidateQueries({
                queryKey: ['listNotes', String(projectID), String(ticketID)],
                exact: true
            });
            openAlert('Nota creada correctamente');
            onSuccess?.();
        },
<<<<<<< Updated upstream
        onError: () => openAlert('Error al crear la nota')
=======
        onError: () => openAlert('Error al registrar la nota')
>>>>>>> Stashed changes
    });

    const { data: notes = [], isPending, isError, error } = useQuery<NoteItem[]>({
        queryKey: ['listNotes', String(projectID), String(ticketID)],
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
