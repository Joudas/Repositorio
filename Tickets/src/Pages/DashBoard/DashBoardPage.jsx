import React, { useEffect, useState } from 'react'
import { SideBard } from '../../Components/UI/SideBard';
import useModal from '../../Components/Hooks/useModal';
import useProjects from '../../Components/Hooks/useProjects';
import { CreateProyectModal } from './CreateProyectModal';
import { overview, ticketsCompleted, ticketsInProgress, ticketsPending, highPriority } from '../../services/ticketsService';

const DashBoardPage = () => {
  const { openModal, isModalOpen, closeModal } = useModal();
  const { useCreateProject } = useProjects();
  const [form, setForm] = useState({name: ''});
  const [totalTickets, setTotalTickets] = useState({});
  const [highTickets, setHighTickets] = useState({});
  const [completedTickets, setCompletedTickets] = useState({});
  const [inProgressTickets, setInProgressTickets] = useState({});
  const [pendingTickets, setPendingTickets] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const overviewData = await overview();
        const completedData = await ticketsCompleted();
        const inProgressData = await ticketsInProgress();
        const pendingData = await ticketsPending();
        const highPriorityData = await highPriority();
        
        setTotalTickets(overviewData);
        setCompletedTickets(completedData);
        setInProgressTickets(inProgressData);
        setPendingTickets(pendingData);
        setHighTickets(highPriorityData);
      }catch(err){
        console.error('Error fetching dashboard data:', err);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    console.log('Total Tickets:', totalTickets);
    console.log('Completed:', completedTickets);
    console.log('In Progress:', inProgressTickets);
    console.log('Pending:', pendingTickets);
    console.log('High Priority:', highTickets);
  }, [totalTickets, completedTickets, inProgressTickets, pendingTickets, highTickets]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await useCreateProject(form);
    if(response.ok){
      closeModal();
      setForm({name: ''});
    }
  }

  return (
    <div className="w-screen h-screen bg-gray-300 flex relative">
      {isModalOpen && <CreateProyectModal handleChange={handleChange} handleSubmit={handleSubmit} closeModal={closeModal}/>}
      <div className="w-52">
        <SideBard/>
      </div>
      <div className="flex-1 h-screen bg-white pr-12 pt-4 pl-11 flex flex-col overflow-hidden">
        {/* User Info */}
        <div className='w-full flex flex-col gap-4'>
          <div className='w-full flex justify-end'>
            <div>
              <h1 className="text-sm font-bold">Bienvenido, Usuario</h1>
              <p className='text-sm text-zinc-400'>Rol</p>
            </div>
            
          </div>
          <div className='w-full flex justify-end'>
            <button 
              onClick={openModal} 
              className="btn-base p-2 px-4 cursor-pointer rounded-sm font-semibold text-white h-10 w-60">
              Crear Nuevo Ticket
            </button>
          </div>
          
        </div>
        {/* Tickets Total */}
        <div className='w-full min-h-30 flex justify-between items-center mt-4 rounded-lg '>
          <div className='bg-brand text-white w-[16%] rounded-lg p-4 shadow-brand'>
            <p className='text-lg font-medium'>Tickets Totales</p>
            <p className='text-5xl font-bold'>{totalTickets.total_tickets}</p>
            <p className='text-end text-sm font-medium'>{totalTickets.high_priority} Hight</p>
          </div>
          <div className='cards w-[16%] min-h-full rounded-lg p-4 text-red-700'>
            <p className='text-lg font-medium'>Tickets Criticos</p>
            <p className='text-5xl font-bold'>{highTickets.high_priority_total}</p>
            <p className='text-end text-sm font-medium'>{highTickets.high_priority_pending} Pending</p>
          </div>
          <div className='cards text-black w-[16%] rounded-lg p-4'>
            <p className='text-lg font-medium'>Tickets Completados</p>
            <p className='text-5xl font-bold'>{completedTickets.total_completed}</p>
            <p className='text-end text-sm font-medium'>{completedTickets.high_priority_completed} Hight</p>
          </div>
          <div className='cards  text-black w-[16%] rounded-lg p-4'>
            <p className='text-lg font-medium'>Tickets En Progreso</p>
            <p className='text-5xl font-bold'>{inProgressTickets.total_in_progress}</p>
            <p className='text-end text-sm font-medium'>{inProgressTickets.high_priority_in_progress} Hight</p>
          </div>
          <div className='cards  text-black w-[16%] rounded-lg p-4'>
            <p className='text-lg font-medium'>Tickets Pendientes</p>
            <p className='text-5xl font-bold'>{pendingTickets.total_pending}</p>
            <p className='text-end text-sm font-medium'>{pendingTickets.high_priority_pending} Hight</p>
          </div>
        </div>
        
        {/* Analitycs */}
        <div className='w-full mt-4 rounded-lg bg-gray-100 flex justify-center items-center flex-1 overflow-auto mb-4'>

        </div>
        
        
      </div>
    </div>
  )
}

export default DashBoardPage;

            