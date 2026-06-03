import React, { useContext } from 'react'
import TicketFormContext from '../../Context/Tickets/TicketFormContext';
import { Spiner } from '../../Components/UI/Spiner';
import ModalShell from '../../Components/UI/ModalShell';

const CreateTicketModal = ({ closeModal }) => {

  const {handleChange, submitTicket, form, loadingForm} = useContext(TicketFormContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await submitTicket();
    if (result.ok) {
      closeModal();
    }
  }

  return (
    <ModalShell closeModal={closeModal} panelClassName='p-8 px-12 bg-white w-100 min-h-40 rounded-sm text-sidebard z-2'>
            <div className='w-full flex justify-start ml-2 items-center text-black gap-2 mb-8'>
                <p className='font-semibold text-xl currentColor text-center'>Crear  Ticket</p>
                <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect x="0" fill="none" width="24" height="24"></rect> <g> <path d="M21 14v5c0 1.105-.895 2-2 2H5c-1.105 0-2-.895-2-2V5c0-1.105.895-2 2-2h5v2H5v14h14v-5h2z"></path> <path d="M21 7h-4V3h-2v4h-4v2h4v4h2V9h4"></path> </g> </g></svg>
            </div>
            <form className='gap-12 grid my-4' onSubmit={handleSubmit}>
                <div className='gap-4 grid'>
                    <label className='text-black ml-2' htmlFor="name">Nombre del Ticket</label>
                    <input value={form.name} onChange={handleChange} type="text" id="name" name="name" className='border-b border-gray-300 px-2 py-1 rounded-sm w-full focus:outline-none focus:border-blue-400'/>
                </div>
                <div className='gap-4 grid'>
                    <label className='text-black ml-2' htmlFor="description">Descripción</label>
                    <textarea value={form.description} onChange={handleChange} id="description" name="description" className='resize-none border-b border-gray-300 px-2 py-1 rounded-sm w-full focus:outline-none focus:border-blue-400'/>
                </div>
                <div className='gap-4 grid'>
                    <label className='text-black ml-2' htmlFor="priority">Prioridad</label>
                    <select value={form.priority} onChange={handleChange} id="priority" name="priority" className='resize-none border-b border-gray-300 px-2 py-1 rounded-sm w-full focus:outline-none focus:border-blue-400'>
                      <option value='low' className='text-blue-400'>Baja</option>
                      <option value='medium' className='text-yellow-400'>Media</option>
                      <option value='high' className='text-red-400'>Alta</option>
                    </select>
                </div>
                <button className='w-full h-10 btn-base rounded-sm relative' disabled={loadingForm}>{loadingForm ? 
                <Spiner/> : <div>Registrar</div> }
                </button>
            </form>
    </ModalShell>
  )
}
export default CreateTicketModal;
