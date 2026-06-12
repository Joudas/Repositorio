import React, { useContext, useEffect, useState, useMemo } from 'react'
import { SideBard } from '../../Components/UI/SideBard';
import { useParams, useNavigate } from 'react-router';
import { getProject } from '../../services/ticketsService';
import { TicketsList } from './TicketsList';
import { NotesPanel } from './NotesPanel';
import { TicketDetails } from './TicketDetails';
import CreateTicketModal from './CreateTicketModal';
import useModal from '../../Components/Hooks/useModal';
import CreateNoteModal from './CreateNote';
import TicketContext from '../../Context/Tickets/TicketContext';
import Alerts from '../../Components/UI/Alerts';
import TicketFormContext from '../../Context/Tickets/TicketFormContext';
import useAlert from '../../Components/Hooks/useAlert';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import EditTicketModal from './EditTicketModal';

const TicketsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const projectId = Number(id) || null;

    const {setProjectID, listTickets, defineTicket, loadTickets, loadingTickets, ticketID, exitMessage} = useContext(TicketContext);
    const {errorForm, deleteTickets} = useContext(TicketFormContext);
    
    const {isModalOpen, openModal, closeModal, activeModal, modalPayload} = useModal();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [loadingProject, setLoadingProject] = useState(false);
    const {isAlertOpen, isSecondAlertOpen} = useAlert();

    const [project, setProject] = useState(null);

    const actualTicket = useMemo(
        () => listTickets.find(t => t.id === ticketID) ?? null,
        [listTickets, ticketID]
    );

    const statesMap = {
        completed: { state: 'Completado', label: 'Completado', next: 'completed', css : 'bg-green-500 hover:bg-green-600', border: 'ticket-border-green' },
        in_progress: { state: 'En Progreso', label: 'Completar Ticket', next: 'completed', css : 'bg-blue-500 hover:bg-blue-600', border: 'ticket-border-blue' },
        pending: { state: 'Pendiente', label: 'Comenzar Ticket', next: 'in_progress', css : 'bg-yellow-500 hover:bg-yellow-600', border: 'ticket-border-yellow' },
    }
    const stateTicket = statesMap[actualTicket?.state] ?? { label: 'Comenzar Ticket', next: 'in_progress', css : 'bg-yellow-500 hover:bg-yellow-600' };
    
    const priorityMap = {
        low: { state: 'Baja', css : 'bg-green-500', color: 'text-green-500' },
        medium: { state: 'Media', css : 'bg-yellow-500', color: 'text-yellow-500' },
        high: { state: 'Alta', css : 'bg-red-500', color: 'text-red-500' },
    }

    useEffect(() => {
        setProjectID(projectId);
    }, [projectId, setProjectID]);

    useEffect(() => {
        if (!projectId) return;

        let isMounted = true;

        const fetchProject = async () => {
            setLoadingProject(true);
            setProject(null);

            try {
                const ticketsResult = await loadTickets(projectId);
                if (!ticketsResult.ok) {
                    throw new Error(ticketsResult.message);
                }

                const response = await getProject(projectId);
                if (isMounted) {
                    setProject(response);
                }
            } catch (err) {
                if (isMounted) {
                    navigate('/dashboard', { replace: true });
                }
            } finally {
                if (isMounted) {
                    setLoadingProject(false);
                }
            }
        };

        fetchProject();

        return () => {
            isMounted = false;
        };
    }, [projectId, navigate, loadTickets]);

  return (
    <div className='w-screen h-screen relative'>
        <div 
        className='absolute top-3 left-3 cursor-pointer z-101' 
        onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 6H20M4 12H20M4 18H20" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
        </div>
        {isMenuOpen && 
            <div><SideBard valuePage={projectId} absolute={'absolute'}/></div>
        }
        <div className='w-full h-full bg-container-tickets flex flex-col justify-start items-center pt-10 gap-4'>
            <div className='text-3xl font-bold'>{loadingProject ? 'Cargando proyecto...' : project?.name}</div>
            <div className='h-[calc(100%-100px)] w-[96%]'>
                <div className='h-full w-full grid grid-cols-12 gap-6 min-w-0'>
                    {/* Lista de tickets */}
                    <TicketsList priorityMap={priorityMap} statesMap={statesMap} listTickets={listTickets} actualTicket={actualTicket} defineTicket={defineTicket} loadingTickets={loadingTickets} openModal={openModal} />
                    {/* Informacion detallada del ticket */}
                    <div className='h-full col-span-8 p-6 px-10 bg-white rounded-lg overflow-auto min-w-0 text-base'>
                        {actualTicket ? (
                        <>
                            <TicketDetails priorityMap={priorityMap} statesMap={statesMap} openModal={openModal} actualTicket={actualTicket} stateTicket={stateTicket}/>
                            <NotesPanel openModal={openModal} />
                        </>
                        ) : 
                        <div className=' text-base italic'>Sin ticket seleccionado</div>
                        }
                    </div>
                </div>
            </div>
        </div>

        {(isModalOpen && activeModal === 'ticket') && <CreateTicketModal closeModal={closeModal}/>} 
        {(isModalOpen && activeModal === 'note') && <CreateNoteModal closeModal={closeModal} />}
        {(isModalOpen && activeModal === 'delete') && <ConfirmDeleteModal closeModal={closeModal} actualTicket={modalPayload} deleteTickets={deleteTickets} />}
        {(isModalOpen && activeModal === 'edit') && <EditTicketModal closeModal={closeModal} actualTicket={modalPayload} />}
        {isAlertOpen && <Alerts message={errorForm} />}
        {isSecondAlertOpen && <Alerts message={exitMessage} />}
    </div>
  )
}

export default TicketsPage;
