import React from 'react'
import useModal from '../../Components/Hooks/useModal';

export const CreateProyectModal = ({handleChange, handleSubmit, closeModal}) => {
  
    return (
    <div className="absolute min-w-full min-h-full bg-container-modal flex justify-center">
        <div className='bg-white w-80 min-h-40 top-10 absolute rounded-sm text-sidebard'>
            <span onClick={closeModal} className="absolute cursor-pointer top-2 right-2 items-center justify-center flex w-6 h-6">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g clipPath="url(#clip0_429_11083)"> <path d="M7 7.00006L17 17.0001M7 17.0001L17 7.00006" stroke="#808080" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path> </g> <defs> <clipPath id="clip0_429_11083"> <rect width="24" height="24" fill="white"></rect> </clipPath> </defs> </g></svg>
            </span>
            <form className='p-4 gap-8 grid my-4' onSubmit={handleSubmit}>
                <div className='gap-4 grid'>
                    <label htmlFor="name">Título del Proyecto</label>
                    <input onChange={handleChange} type="text" id="name" name="name" className='border-b border-gray-300 px-2 py-1 rounded-sm w-full focus:outline-none focus:border-blue-400'/>
                </div>
                <button type="submit" className='w-full h-8 btn-base rounded-sm'>Crear</button>
            </form>
        </div>
    </div>
  )
}
