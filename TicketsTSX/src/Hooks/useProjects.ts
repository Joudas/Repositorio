import { createProject, getProjects } from '@/services/ticketsService';

const useProjects = () => {

    const useCreateProjects = async (form) => {
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

  return {useCreateProjects, useGetProject};
}
export default useProjects;
