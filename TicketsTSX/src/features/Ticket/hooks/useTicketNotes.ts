import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNote, getNotes } from "@/services/ticketsService";
import type { NoteForm, NoteItem } from "../types";

export function useTicketNotes(
  projectID?: string | null,
  ticketID?: string | null,
  onSuccessNote?: () => void
) {
  const queryClient = useQueryClient();
  const [formNotes, setFormNotes] = useState<NoteForm>({ note: "" });

  const {
    data: notesResponse,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["ticketNotes", projectID, ticketID],
    queryFn: () => getNotes(projectID, ticketID),
    enabled: !!projectID && !!ticketID,
  });

  const notes: NoteItem[] = Array.isArray(notesResponse)
    ? notesResponse
    : notesResponse?.notes ?? [];

  const { mutate: submitNote } = useMutation({
    mutationFn: () => createNote(formNotes, projectID, ticketID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticketNotes", projectID, ticketID] });
      onSuccessNote?.();
    },
    onSettled: () => {
      resetNotes();
    },
  });

  const resetNotes = () => {
    setFormNotes({ note: "" });
  };

  return {
    notes,
    isPending,
    isError,
    error,
    formNotes,
    setFormNotes,
    submitNote,
    resetNotes,
  };
}
