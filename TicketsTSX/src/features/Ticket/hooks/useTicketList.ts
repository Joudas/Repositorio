import { useQueryClient } from '@/Hooks/useQuery';
import { changeStateTicket, createTicket, deleteTicket, getTicketProject, updateTicket } from '@/services/ticketsService';
import { useMutation, useQuery } from '@tanstack/react-query';
<<<<<<< Updated upstream
import type { TicketForm } from '../types';
import { useAlertStore } from '@/Store/alertStore';
=======
import type { TicketForm, TicketItem } from '../types';
import { useState, type ChangeEvent } from 'react';
import { useAlertStore } from '@/Store/useAlertStore';
import { useParams } from 'react-router';
>>>>>>> Stashed changes

export function useTicketList(projectID?: string | null, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  const { openAlert } = useAlertStore();

<<<<<<< Updated upstream
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
=======
export function useTicketList(onSuccess?: () => void){
  
    const { id: projectID } = useParams<{ id: string }>();
    const queryClient = useQueryClient();
    const [form, setForm] = useState<TicketForm>(formTicket);
    const { openAlert } = useAlertStore();

    const { data: projectData, isPending: isPendingTicket, isError: isErrorTicket, error: errorTicket } = useQuery({
      queryKey: ['listTickets', projectID], 
      queryFn: () => getTicketProject(projectID),
      enabled: !!projectID
    });

    const listTickets = Array.isArray(projectData?.tickets) ? projectData.tickets : (projectData ?? []);
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
  const resetForm = () => {
    onSuccess?.();
  };


  return {
    listTickets, isPendingTicket, isErrorTicket, errorTicket, loadingForm, loadingStateChange,
    submitTicket, editTicket, deleteTickets, changeState, resetForm
=======
    const {mutate: submitTicket, mutateAsync: submitTicketAsync, isPending: loadingSubmit} = useMutation({
      mutationFn: ({ payload, projectID: pid }: { payload: TicketForm; projectID?: string | null }) => createTicket(payload, pid ?? projectID),
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['listTickets'] })
          openAlert('Ticket creado correctamente');
      },
      onError: () => {
        openAlert('Hubo un error al crear el ticket');
      },
      onSettled: () => {
        resetForm();
      }
    });

    const {mutate: editTicket, isPending: loadingSubmitEdit} = useMutation({
      mutationFn: (id) => updateTicket(form, id), //form, id
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['listTickets'] })
          openAlert('Ticket actualizado correctamente');
          onSuccess?.();
      },
      onError: () => {
        openAlert('Hubo un error al actualizar el ticket');
      },
      onSettled: () => {
        resetForm();
      }
    });

    const {mutate: deleteTickets} = useMutation({
      mutationFn: deleteTicket, //form, id
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['listTickets'] })
          openAlert('Ticket eliminado correctamente');
      },
      onError: () => {
        openAlert('Hubo un error al eliminar el ticket', true);
      },
      onSettled: () => {
        resetForm();
      }
    });

    const {mutate: changeState, isPending: loadingStateChange} = useMutation({
      mutationFn: ({ state, ticketID }: { state: string; ticketID: string }) => changeStateTicket(state, ticketID), // {state, ticketID}
      onMutate: async ({ state, ticketID }: { state: string; ticketID: string }) => {
        if (!projectID) return { rollback: null };
        await queryClient.cancelQueries({ queryKey: ['listTickets', projectID] });
        const previous = queryClient.getQueryData<any>(['listTickets', projectID]);
        queryClient.setQueryData(['listTickets', projectID], (old: any) => {
          if (!old) return old;
          if (Array.isArray(old)) {
            return old.map((t: any) => t.id === ticketID ? { ...t, state } : t);
          }
          if (Array.isArray(old.tickets)) {
            return { ...old, tickets: old.tickets.map((t: any) => t.id === ticketID ? { ...t, state } : t) };
          }
          return old;
        });
        return { rollback: previous };
      },
      onError: (_err, _vars, context: any) => {
        if (projectID && context?.rollback) {
          queryClient.setQueryData(['listTickets', projectID], context.rollback);
        }
        openAlert('Hubo un error al actualizar el ticket');
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['listTickets'] });
        openAlert('Ticket actualizado correctamente');
      },
      onSettled: () => {
        resetForm();
      }
    });

    const loadTicketUpdate = (actualTicket: TicketItem) => {
      setForm({
            name: actualTicket.name || '',
            description: actualTicket.description || '',
            state: actualTicket.state || 'pending',
            priority: actualTicket.priority || 'low',
        });
    }

    const resetForm = () => {
        setForm(formTicket);
        onSuccess?.();
    };


  return { 
    listTickets, isPendingTicket, isErrorTicket, errorTicket, form, loadingSubmit, submitTicketAsync,
    submitTicket, deleteTickets,loadingStateChange, changeState, handleChange, resetForm,
    editTicket, loadingSubmitEdit, loadTicketUpdate
>>>>>>> Stashed changes
  };
}
