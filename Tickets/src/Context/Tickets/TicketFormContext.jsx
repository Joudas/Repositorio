import { createContext, useContext, useState } from "react";
import {createTicket, changeStateTicket, deleteTicket, updateTicket} from '../../services/ticketsService';
import TicketContext from "./TicketContext";
import useAlert from "../../Components/Hooks/useAlert";

const TicketFormContext = createContext();

const formTicket = {
    name: '',
    description: '',
    state: 'pending',
    priority: 'low',
}
const TicketFormProvider = ({ children }) => {
    const {openAlert} = useAlert();
    const {projectID, loadTickets, setExitMessage } = useContext(TicketContext);

    const [loadingForm, setLoadingForm] = useState(false);
    const [loadingStateChange, setLoadingStateChange] = useState(false);
    const [errorForm, setErrorForm] = useState('');
    const [form, setForm] = useState(formTicket);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    }

    const submitTicket = async () => {
        if (!projectID) {
            return { ok: false, message: 'Project ID is required' };
        }

        if (!form.name.trim() || !form.description.trim()) {
            return { ok: false, message: 'Name and description are required' };
        }

        setLoadingForm(true);
        setErrorForm('');
        try {
            const response = await createTicket(form, projectID);
            const ticketsResult = await loadTickets(projectID);
            if (!ticketsResult.ok) {
                throw new Error(ticketsResult.message);
            }
            setExitMessage('Ticket creado correctamente');
            setForm(formTicket);
            return { ok: true, data: response };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to create ticket';
            setErrorForm(message);
            openAlert();
            return { ok: false, message };
        } finally {
            setLoadingForm(false);
        }
    }

    const editTicket = async (id) => {
        if (!projectID) {
            return { ok: false, message: 'Project ID is required' };
        }
        if (!form.name.trim() || !form.description.trim()) {
            return { ok: false, message: 'Name and description are required' };
        }
        setLoadingForm(true);
        setErrorForm('');
        try{
            const response = await updateTicket(form, id);
            const ticketsResult = await loadTickets(projectID);
            if (!ticketsResult.ok) {
                throw new Error(ticketsResult.message);
            }
            setExitMessage('Ticket actualizado correctamente');
            setForm(formTicket);
            return { ok: true, data: response };
        }catch(err){
            const message = err instanceof Error ? err.message : 'Failed to update ticket';
            setErrorForm(message);
            openAlert();
            return { ok: false, message };
        }finally{
            setLoadingForm(false);
        }
    }

    const deleteTickets = async (id) => {
        if (!projectID) {
            return { ok: false, message: 'Project ID is required' };
        }
        setErrorForm('');
        setLoadingForm(true);
        try{
            const response = await deleteTicket(id);
            const ticketsResult = await loadTickets(projectID);
            if (!ticketsResult.ok) {
                throw new Error(ticketsResult.message);
            }
            setForm(formTicket);
            return { ok: true, data: response };
        }catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to delete ticket';
            setErrorForm(message);
            openAlert();
            return { ok: false, message };
        }finally{
            setLoadingForm(false);
        }
    }

    const changeState = async (state, id) => {
        if (!projectID) {
            return { ok: false, message: 'Project ID is required' };
        }

        setLoadingStateChange(true);
        setErrorForm('');
        try{
            const response = await changeStateTicket({ state }, id);
            const ticketsResult = await loadTickets(projectID);
            if (!ticketsResult.ok) {
                throw new Error(ticketsResult.message);
            }
            if(response.ok){
                setExitMessage('Estado del ticket actualizado correctamente'); 
                
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to change ticket state';
            setErrorForm(message);
            openAlert();
        }finally{
            setLoadingStateChange(false);
        }
    }
    const resetForm = () => {
        setErrorForm(null);
        setLoadingForm(false);
        setLoadingStateChange(false);
        setForm(formTicket);
    }

    const data = { 
        form, setForm,
        submitTicket,
        handleChange,
        changeState,
        deleteTickets,
        editTicket,
        loadingForm, loadingStateChange, errorForm,
        resetForm
    };
    return <TicketFormContext.Provider value={data}>{children}</TicketFormContext.Provider>;
}

export {TicketFormProvider}
export default TicketFormContext;