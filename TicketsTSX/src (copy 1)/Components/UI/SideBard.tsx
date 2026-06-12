import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router';
import AuthContext from '../../Context/Auth/AuthContext';
import useProjects from '../Hooks/useProjects';

export const SideBard = ({valuePage = 0, absolute = ''}) => {
    const {logoutAuth} = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [page, setPage] = useState(valuePage);
    const {useGetProject} = useProjects()
    //Cargamos los proyectos
    useEffect(() => {
        const handleFetch = async () => {
            const response = await useGetProject();
            if(response?.data){
               const projects =  response.data;
               setProjects(projects);
            }
        }
        handleFetch();
    },[]);

  return (
    <div className={`w-52 p-2 h-screen bg-white text-sidebard z-100 ${absolute}`}>
        <div className='w-full h-full bg-sidebard rounded-lg flex flex-col'>
            <div className='w-full h-24 text-black font-semibold text-2xl justify-center items-center flex'>Tickets</div>
            <div className='w-full flex-1 flex flex-col justify-start items-center gap-2 pb-10'>
                <Link to={'/dashboard'} onClick={() => setPage(0)} 
                className={`rounded-sm flex px-4 gap-2 justify-start items-center cursor-pointer w-[90%] h-8 bg-btn hover:text-white
                ${page === 0 ? 'bg-white shadow-md' : 'bg-transparent'}`}>
                    <svg width="18px" height="18px" viewBox="0 0 24 24" id="meteor-icon-kit__solid-dashboard" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path fillRule="evenodd" clipRule="evenodd" d="M2 0H7C8.10457 0 9 0.89543 9 2V7C9 8.10457 8.10457 9 7 9H2C0.89543 9 0 8.10457 0 7V2C0 0.89543 0.89543 0 2 0ZM2 11H7C8.10457 11 9 11.8954 9 13V22C9 23.1046 8.10457 24 7 24H2C0.89543 24 0 23.1046 0 22V13C0 11.8954 0.89543 11 2 11ZM13 0H22C23.1046 0 24 0.89543 24 2V13C24 14.1046 23.1046 15 22 15H13C11.8954 15 11 14.1046 11 13V2C11 0.89543 11.8954 0 13 0ZM13 17H22C23.1046 17 24 17.8954 24 19V22C24 23.1046 23.1046 24 22 24H13C11.8954 24 11 23.1046 11 22V19C11 17.8954 11.8954 17 13 17Z" fill="currentColor"></path></g></svg>
                    <p className=''>DashBoard</p>
                </Link>
                <div className='w-full flex-1 flex flex-col justify-start items-center gap-2 mt-6'>
                    <div className="flex px-4 gap-2 justify-start items-center cursor-pointer w-[90%] h-8 text-sm">
                        <p className=''>Mis Tickets</p>
                    </div>
                    {/* Map para los proyectos */}
                    {Array.isArray(projects) && projects.map((pj) => {
                    const id = pj.id;
                    return (
                        <Link to={'/tickets/'+id} 
                        key={id} 
                        onClick={() => setPage(id)}
                        className={`flex px-4 gap-2 justify-start items-center cursor-pointer w-[90%] h-8 rounded-sm
                        bg-btn hover:text-white ${page === id ? 'bg-white shadow-md' : 'bg-transparent'}`}>
                            <svg width="18px" height="18px" viewBox="0 0 24 24" id="meteor-icon-kit__solid-dashboard" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path fillRule="evenodd" clipRule="evenodd" d="M2 0H7C8.10457 0 9 0.89543 9 2V7C9 8.10457 8.10457 9 7 9H2C0.89543 9 0 8.10457 0 7V2C0 0.89543 0.89543 0 2 0ZM2 11H7C8.10457 11 9 11.8954 9 13V22C9 23.1046 8.10457 24 7 24H2C0.89543 24 0 23.1046 0 22V13C0 11.8954 0.89543 11 2 11ZM13 0H22C23.1046 0 24 0.89543 24 2V13C24 14.1046 23.1046 15 22 15H13C11.8954 15 11 14.1046 11 13V2C11 0.89543 11.8954 0 13 0ZM13 17H22C23.1046 17 24 17.8954 24 19V22C24 23.1046 23.1046 24 22 24H13C11.8954 24 11 23.1046 11 22V19C11 17.8954 11.8954 17 13 17Z" fill="currentColor"></path></g></svg>
                            <p className='wrap-break-word flex w-full text-sm'>{pj.name}</p>
                        </Link>
                    )
                    })}
                </div>
                <div className="w-[90%] h-8">
                    <button 
                    className='border border-white w-full h-full p-x cursor-pointer justify-start items-center hover:border-blue-500 hover:text-blue-500'
                    onClick={logoutAuth}>Cerrar Sesión</button>
                </div>
            </div>
        </div>
    </div>
  )
}
