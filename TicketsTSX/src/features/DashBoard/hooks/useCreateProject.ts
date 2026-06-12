import { createProject } from '@/services/ticketsService';
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import{ useState } from 'react'

type useCreateType = {
    mutation: UseMutationResult<any, Error, void, unknown>;
    handleChange: (e: {
        target: {
            name: string;
            value: string;
        };
    }) => void;
}
export default function useCreateProject(onSuccess?: () => void) {
    const [form, setForm] = useState<{ name: string }>({ name: '' });
    const queryClient = useQueryClient();
    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    }

    const mutation = useMutation({
        mutationFn: () => createProject(form),
        onSuccess: () => {
            setForm({ name: '' })
            onSuccess?.();
            queryClient.invalidateQueries({ queryKey: ['projects'] })
        }
    })

    const data: useCreateType = {
        handleChange, mutation
    }
  return data
}
