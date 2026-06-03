import React from 'react'
import { createTicket, getTicketProject } from '../../services/ticketsService';

const useTickets = () => {

    const useCreateTicket = async (form) => {
        try{
            const response = await createTicket(form);
            return { ok: true, data: response };
        }catch(error){
            return { ok: false, error };
        }
    }
    const useGetTicket = async () => {
        try{
            const response = await getTicketProject();
            return { ok: true, data: response };
        }catch(error){
            return { ok: false, error }
        }
    }

  return {useCreateTicket, useGetTicket};
}
export default useTickets;
