import { useQueryClient } from '@/Hooks/useQuery';
import { changeStateTicket, createTicket, deleteTicket, getTicketProject, updateTicket } from '@/services/ticketsService';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { TicketForm } from '../types';
import { useAlert } from '@/Context/Alert/AlertContext';
import { useEffect, useState, type ChangeEvent } from 'react';

const formTicket: TicketForm = {
  name: '',
  description: '',
  state: 'pending',
  priority: 'low',
};


export function useTicketList(projectID?: string | null, onSuccess?: () => void){
    const queryClient = useQueryClient();
    const [form, setForm] = useState<TicketForm>(formTicket);
    const { openAlert } = useAlert();

    const { data: projectData, isPending: isPendingTicket, 
      isError: isErrorTicket, error: errorTicket } = useQuery({
      queryKey: ['listTickets', projectID], 
      queryFn: () => getTicketProject(projectID)
    });

    const listTickets = Array.isArray(projectData?.tickets)
      ? projectData.tickets
      : (projectData ?? []);

    useEffect(() => {
      console.log(listTickets);
    }, [listTickets])

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
        ...prevForm,
        [name]: value,
        }));
    };

    const {mutate: submitTicket} = useMutation({
      mutationFn: createTicket,
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

    const {mutate: editTicket} = useMutation({
      mutationFn: (id) => updateTicket(form, id), //form, id
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
    const {mutate: deleteTickets} = useMutation({
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
    const {mutate: changeState} = useMutation({
      mutationFn: changeStateTicket, //{state}, id
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
        setForm(formTicket);
        onSuccess?.();
    };


  return { 
    listTickets, isPendingTicket, isErrorTicket, errorTicket, form,
    submitTicket, editTicket, deleteTickets, changeState, handleChange, resetForm
   };
}
