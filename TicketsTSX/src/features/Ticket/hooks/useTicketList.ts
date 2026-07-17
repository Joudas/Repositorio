import { useState } from "react";
import { useQueryClient } from '@/Hooks/useQuery';
import { changeStateTicket, createTicket, deleteTicket, getTicketProject, updateTicket } from '@/services/ticketsService';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { TicketForm, TicketItem } from '../types';
import { useAlertStore } from '@/Store/alertStore';

const defaultForm: TicketForm = {
  name: "",
  description: "",
  state: "pending",
  priority: "low",
};

export function useTicketList(projectID?: string | null, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  const { openAlert } = useAlertStore();
  const [form, setForm] = useState<TicketForm>(defaultForm);

  const { data: projectData, isPending: isPendingTicket,
    isError: isErrorTicket, error: errorTicket } = useQuery({
      queryKey: ['listTickets', projectID],
      queryFn: () => getTicketProject(projectID)
    });

  const listTickets: TicketItem[] = Array.isArray(projectData?.tickets)
    ? projectData.tickets
    : (projectData ?? []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const loadTicketUpdate = (ticket: TicketItem) => {
    setForm({
      name: ticket.name,
      description: ticket.description,
      state: ticket.state,
      priority: ticket.priority,
    });
  };

  const { mutate: submitTicket, isPending: loadingForm } = useMutation({
    mutationFn: (ticketForm: TicketForm) => createTicket(ticketForm, projectID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listTickets', projectID] })
      openAlert('Ticket creado correctamente');
    },
    onError: () => {
      openAlert('Hubo un error al crear el ticket');
    },
    onSettled: () => {
      resetForm();
    }
  });

  const { mutate: editTicket, isPending: loadingSubmitEdit } = useMutation({
    mutationFn: (id: string) => updateTicket(form, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listTickets', projectID] })
      openAlert('Ticket actualizado correctamente');
    },
    onError: () => {
      openAlert('Hubo un error al actualizar el ticket');
    },
    onSettled: () => {
      resetForm();
    }
  });

  const { mutate: deleteTickets } = useMutation({
    mutationFn: deleteTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listTickets', projectID] })
      openAlert('Ticket eliminado correctamente');
    },
    onError: () => {
      openAlert('Hubo un error al eliminar el ticket');
    },
    onSettled: () => {
      resetForm();
    }
  });

  const { mutate: changeState, isPending: loadingStateChange } = useMutation({
    mutationFn: ({ state, ticketID }: { state: string; ticketID: string }) => changeStateTicket(state, ticketID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listTickets', projectID] })
      openAlert('Ticket actualizado correctamente');
    },
    onError: () => {
      openAlert('Hubo un error al actualizar el ticket');
    },
    onSettled: () => {
      resetForm();
    }
  });

  const resetForm = () => {
    setForm(defaultForm);
    onSuccess?.();
  };

  return {
    listTickets, isPendingTicket, isErrorTicket, errorTicket,
    loadingForm, loadingSubmitEdit, loadingStateChange,
    submitTicket, editTicket, deleteTickets, changeState,
    loadTicketUpdate, handleChange, form, setForm, resetForm
  };
}
