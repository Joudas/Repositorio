import React, { useContext, useEffect } from 'react'
import TicketFormContext from '../../Context/Tickets/TicketFormContext';
import { Spiner } from '../../Components/UI/Spiner';
import ModalShell from '../../Components/UI/ModalShell';

const EditTicketModal = ({closeModal, actualTicket}) => {
    const {setForm, form, handleChange, editTicket, loadingForm} = useContext(TicketFormContext);

    useEffect(() => {
        if (!actualTicket) return;
        setForm({
            name: actualTicket.name || '',
            description: actualTicket.description || '',
            state: actualTicket.state || 'pending',
            priority: actualTicket.priority || 'low',
        });
    },[actualTicket, setForm])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await editTicket(actualTicket.id);
        if (result.ok) {
            closeModal();
        }
    }
    return (
        <ModalShell closeModal={closeModal} panelClassName='px-12 bg-white w-100 p-8 min-h-40 rounded-sm text-sidebard z-2'>
            <div className='w-full flex justify-start ml-2 items-center text-black gap-2 mb-8'>
                <p className='font-semibold text-xl currentColor text-center'>Editar Ticket</p>
                <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="CurrentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="CurrentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            </div>
            <form className=' gap-12 grid mt-4' onSubmit={handleSubmit}>
                <div className='gap-4 grid'>
                    <label className='text-black ml-2' htmlFor="name">Nombre del Ticket</label>
                    <input value={form.name} onChange={handleChange} type="text" id="name" name="name" className='border-b border-gray-300 px-2 py-1 rounded-sm w-full focus:outline-none focus:border-blue-400'/>
                </div>
                <div className='gap-4 grid'>
                    <label className='text-black ml-2' htmlFor="description">Descripción</label>
                    <textarea value={form.description} onChange={handleChange} id="description" name="description" className='resize-none border-b border-gray-300 px-2 py-1 rounded-sm w-full focus:outline-none focus:border-blue-400'/>
                </div>
                <div className='gap-4 grid'>
                    <label className='text-black ml-2' htmlFor="state">Estado</label>
                    <select value={form.state} onChange={handleChange} id="state" name="state" className='resize-none border-b border-gray-300 px-2 py-1 rounded-sm w-full focus:outline-none focus:border-blue-400'>
                        <option value='pending' className='text-amber-400'>Pendiente</option>
                        <option value='in_progress' className='text-blue-400'>En Progreso</option>
                        <option value='completed' className='text-green-400'>Completado</option>
                    </select>
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

export default EditTicketModal;
