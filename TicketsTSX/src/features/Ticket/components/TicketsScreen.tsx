import { useState, useMemo } from 'react'
import { TicketsList } from './TicketsList';
import { NotesPanel } from './NotesPanel';
import { TicketDetails } from './TicketDetails';
import { SideBard } from '@/Components/UI/SideBard';
import { useTickets } from '../context/TicketContext';
import useModalTickets from '../hooks/useModalTickets';
import CreateTicketModal from '../modals/CreateTicketModal';
import CreateNoteModal from '../modals/CreateNote';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';
import EditTicketModal from '../modals/EditTicketModal';
import Alerts from '@/Components/Alerts/Alerts';
import useProject from '../hooks/useProject';
import { useParams } from 'react-router';
import { useAlertStore } from '@/Store/alertStore';


const TicketsScreen = () => {
    const { id: projectID } = useParams<{ id: string }>();

    const { listTickets, defineTicket, isPendingTicket,
        ticketID } = useTickets();
    const { isModalOpen, openModal, closeModal, activeModal,
        modalPayload } = useModalTickets();
    const { isOpen, message } = useAlertStore();
    const { project, isPending } = useProject({ projectID });

    const [isMenuOpen, setIsMenuOpen] = useState(false);


    const actualTicket = useMemo(
        () => listTickets?.find(t => t.id === ticketID) ?? null,
        [listTickets, ticketID]
    );

    const statesMap = {
        completed: { state: 'Completado', label: 'Completado', next: 'completed', css: 'bg-green-500 hover:bg-green-600', border: 'ticket-border-green' },
        in_progress: { state: 'En Progreso', label: 'Completar Ticket', next: 'completed', css: 'bg-blue-500 hover:bg-blue-600', border: 'ticket-border-blue' },
        pending: { state: 'Pendiente', label: 'Comenzar Ticket', next: 'in_progress', css: 'bg-yellow-500 hover:bg-yellow-600', border: 'ticket-border-yellow' },
    } as const;
    const stateTicket = statesMap[actualTicket?.state as keyof typeof statesMap] ?? { state: 'pending', label: 'Comenzar Ticket', next: 'in_progress', css: 'bg-yellow-500 hover:bg-yellow-600', border: 'ticket-border-yellow' };

    const priorityMap = {
        low: { state: 'Baja', css: 'bg-green-500', color: 'text-green-500' },
        medium: { state: 'Media', css: 'bg-yellow-500', color: 'text-yellow-500' },
        high: { state: 'Alta', css: 'bg-red-500', color: 'text-red-500' },
    }


    return (
        <div className='w-screen h-screen relative'>
            <div
                className='absolute top-3 left-3 cursor-pointer z-101'
                onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 6H20M4 12H20M4 18H20" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            </div>
            {isMenuOpen &&
                <div><SideBard valuePage={projectID} absolute={'absolute'} /></div>
            }
            <div className='w-full h-full bg-container-tickets flex flex-col justify-start items-center pt-10 gap-4'>
                <div className='text-3xl font-bold'>{isPending ? 'Cargando proyecto...' : project?.name}</div>
                <div className='h-[calc(100%-100px)] w-[96%]'>
                    <div className='h-full w-full grid grid-cols-12 gap-6 min-w-0'>
                        {/* Lista de tickets */}
                        <TicketsList isPending={isPendingTicket} priorityMap={priorityMap} statesMap={statesMap} listTickets={listTickets} actualTicket={actualTicket} defineTicket={defineTicket} openModal={openModal} />
                        {/* Informacion detallada del ticket */}
                        <div className='h-full col-span-8 p-6 px-10 bg-white rounded-lg overflow-auto min-w-0 text-base'>
                            {actualTicket ? (
                                <>
                                    <TicketDetails priorityMap={priorityMap} statesMap={statesMap} openModal={openModal} actualTicket={actualTicket} stateTicket={stateTicket} />
                                    <NotesPanel openModal={openModal} />
                                </>
                            ) :
                                <div className=' text-base italic'>Sin ticket seleccionado</div>
                            }
                        </div>
                    </div>
                </div>
            </div>

            {(isModalOpen && activeModal === 'ticket') && <CreateTicketModal projectID={projectID} closeModal={closeModal} />}
            {(isModalOpen && activeModal === 'note') && <CreateNoteModal closeModal={closeModal} />}
            {(isModalOpen && activeModal === 'delete') && <ConfirmDeleteModal closeModal={closeModal} actualTicket={modalPayload} />}
            {(isModalOpen && activeModal === 'edit') && <EditTicketModal closeModal={closeModal} actualTicket={modalPayload} />}
            {isOpen && <Alerts message={message} />}
        </div>
    )
}

export default TicketsScreen;

