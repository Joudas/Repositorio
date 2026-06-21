import type { TicketListType } from '../types';

export const TicketsList = ({ priorityMap, statesMap, listTickets, actualTicket, defineTicket, isPending, openModal }: TicketListType) => {

    const handleCreateNew = () => {
        openModal('ticket');
    };

    return (
        <>
            <div className='col-span-4 h-full p-6 bg-white rounded-lg overflow-auto min-w-0'>
                <div className='w-full flex justify-between'>
                    <p className='text-xl font-semibold'>Tickets</p>
                    <button onClick={handleCreateNew}
                        className='border-b px-2 border-brand text-brand cursor-pointer'>Crear Nuevo</button>
                </div>
                <div className='mt-10 flex flex-col gap-10'>
                    {isPending ? (
                        <div className='text-gray-500 text-medium'>Cargando tickets...</div>
                    ) : listTickets.length > 0 ? listTickets.map((ticket, idx) => {
                        const priorityTicket = priorityMap[ticket?.priority as keyof typeof priorityMap] ?? { state: 'Baja', css: 'bg-green-500' }
                        const stateBanner = statesMap[ticket?.state as keyof typeof statesMap] ?? { state: 'En Progreso', css: 'bg-yellow-500 hover:bg-yellow-600', border: 'ticket-border-yellow' };
                        return (
                            <div key={ticket.id}
                                onClick={() => defineTicket(ticket.id)}
                                className={`tickets-containers w-full h-10 text-sm relative min-w-0 cursor-pointer ${actualTicket?.id === ticket.id ? `tickets-containers-selected ${stateBanner.border}` : ''}`}>
                                <div className={`absolute waiting-container h-4 text-xs font-medium w-30 ${stateBanner.css}`}>{stateBanner.state}</div>
                                <div className='flex justify-between w-full'>
                                    <div className='flex'>
                                        <span className='font-semibold mr-2'>#{(idx + 1).toString().padStart(2, '0')}</span>
                                        <span className='truncate block max-w-full'>{ticket.name}</span>
                                    </div>
                                    <div className={`pr-4 font-semibold flex items-center gap-1`}> <p className={`${priorityTicket.css} h-2 w-2 rounded-full`}></p> {priorityTicket.state}</div>
                                </div>
                            </div>
                        )
                    }) : <div className='text-gray-500 text-medium'>Sin Tickets Creados...</div>}
                </div>
            </div>
        </>
    )
}
