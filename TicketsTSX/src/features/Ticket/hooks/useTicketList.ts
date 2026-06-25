import { useQueryClient } from '@/Hooks/useQuery';
import { changeStateTicket, createTicket, deleteTicket, getTicketProject, updateTicket } from '@/services/ticketsService';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { TicketForm } from '../types';
import { useAlertStore } from '@/Store/alertStore';

export function useTicketList(projectID?: string | null, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  const { openAlert } = useAlertStore();

  const { data: projectData, isPending: isPendingTicket,
    isError: isErrorTicket, error: errorTicket } = useQuery({
      queryKey: ['listTickets', projectID],
      queryFn: () => getTicketProject(projectID)
    });

  const listTickets = Array.isArray(projectData?.tickets)
    ? projectData.tickets
    : (projectData ?? []);

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

  const { mutate: editTicket } = useMutation({
    mutationFn: ({ form, id }: { form: TicketForm, id: string }) => updateTicket(form, id), //form, id
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
    mutationFn: deleteTicket, //form, id
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
    mutationFn: ({ state, ticketID }: { state: string; ticketID: string }) => { console.log(state, ticketID); return changeStateTicket(state, ticketID) },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listTickets', projectID] })
      openAlert('Ticket actualizar correctamente');
    },
    onError: () => {
      openAlert('Hubo un error al actualizar el ticket');
    },
    onSettled: () => {
      resetForm();
    }
  });

  const resetForm = () => {
    onSuccess?.();
  };


  return {
    listTickets, isPendingTicket, isErrorTicket, errorTicket, loadingForm, loadingStateChange,
    submitTicket, editTicket, deleteTickets, changeState, resetForm
  };
}
