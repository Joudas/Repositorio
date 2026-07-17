import { highPriority, overview, ticketsCompleted, ticketsInProgress, ticketsPending } from '@/services/ticketsService';
import { useQuery } from '@tanstack/react-query';

type useTicketsType = {
    totalTickets: totalTicketType;
    highTickets: highTicketType;
    completedTickets: totalTicketType;
    inProgressTickets: totalTicketType;
    pendingTickets: totalTicketType;
    
}
type totalTicketType = {
    total_tickets:number,
    high_priority: number
}
type highTicketType = {
    high_priority_total: number,
    high_priority_pending: number
}

export default function useTicket() {
    
    const overViewData = useQuery({ queryKey: ['overViewData'], queryFn: overview })
    const completedData = useQuery({ queryKey: ['completedData'], queryFn: ticketsCompleted })
    const inProgressData = useQuery({ queryKey: ['inProgressData'], queryFn: ticketsInProgress })
    const pendingData = useQuery({ queryKey: ['pendingData'], queryFn: ticketsPending })
    const highPriorityData = useQuery({ queryKey: ['highPriorityData'], queryFn: highPriority })
    
    const totalTickets = overViewData.data ?? { total_tickets: 0, high_priority: 0 };
    const completedTickets = completedData.data ?? { total_tickets: 0, high_priority: 0 };
    const inProgressTickets = inProgressData.data ?? { total_tickets: 0, high_priority: 0 };
    const pendingTickets = pendingData.data ?? { total_tickets: 0, high_priority: 0 };
    const highTickets = highPriorityData.data ?? { high_priority_total: 0, high_priority_pending: 0 };
    
    const data: useTicketsType = {
        totalTickets, highTickets, completedTickets, inProgressTickets, 
        pendingTickets
    }
  return data
}


