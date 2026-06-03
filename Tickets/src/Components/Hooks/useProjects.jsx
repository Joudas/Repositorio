import React from 'react'
import { createProject, getProjects } from '../../services/ticketsService';

const useProjects = () => {

    const useCreateProject = async (form) => {
        try{
            const response = await createProject(form);
            return { ok: true, data: response };
        }catch(error){
            return { ok: false, error };
        }
    }
    const useGetProject = async () => {
        try{
            const response = await getProjects();
            return { ok: true, data: response };
        }catch(error){
            return { ok: false, error }
        }
    }

  return {useCreateProject, useGetProject};
}
export default useProjects;
