import React, { createContext, useContext, useState, type ReactNode } from "react";
import { createTicket, changeStateTicket, deleteTicket, updateTicket } from '../../services/ticketsService';
import TicketContext, { TicketContextType } from "./TicketContext";
import useAlert from "../../Components/Hooks/useAlert";

export type TicketForm = {
  name: string;
  description: string;
  state: string;
  priority: string;
};

export type TicketFormContextType = {
  form: TicketForm;
  setForm: React.Dispatch<React.SetStateAction<TicketForm>>;
  submitTicket: () => Promise<{ ok: boolean; data?: any; message?: string }>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  changeState: (state: string, id: string) => Promise<void>;
  deleteTickets: (id: string) => Promise<{ ok: boolean; data?: any; message?: string }>;
  editTicket: (id: string) => Promise<{ ok: boolean; data?: any; message?: string }>;
  loadingForm: boolean;
  loadingStateChange: boolean;
  errorForm: string | null;
  resetForm: () => void;
};

const TicketFormContext = createContext<TicketFormContextType | undefined>(undefined);

const formTicket: TicketForm = {
  name: '',
  description: '',
  state: 'pending',
  priority: 'low',
};

export const TicketFormProvider = ({ children }: { children: ReactNode }) => {
  const { openAlert } = useAlert();
  const { projectID, loadTickets, setExitMessage } = useContext<TicketContextType | undefined>(TicketContext) || {};

  const [loadingForm, setLoadingForm] = useState<boolean>(false);
  const [loadingStateChange, setLoadingStateChange] = useState<boolean>(false);
  const [errorForm, setErrorForm] = useState<string | null>('');
  const [form, setForm] = useState<TicketForm>(formTicket);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

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
      const response = await createTicket(form, projectID!);
      const ticketsResult = await loadTickets!(projectID!);
      if (!ticketsResult.ok) {
        throw new Error(ticketsResult.message);
      }
      setExitMessage && setExitMessage('Ticket creado correctamente');
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
  };

  const editTicket = async (id: string) => {
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
      const ticketsResult = await loadTickets!(projectID!);
      if (!ticketsResult.ok) {
        throw new Error(ticketsResult.message);
      }
      setExitMessage && setExitMessage('Ticket actualizado correctamente');
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
  };

  const deleteTickets = async (id: string) => {
    if (!projectID) {
      return { ok: false, message: 'Project ID is required' };
    }
    setErrorForm('');
    setLoadingForm(true);
    try{
      const response = await deleteTicket(id);
      const ticketsResult = await loadTickets!(projectID!);
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
  };

  const changeState = async (state: string, id: string) => {
    if (!projectID) {
      return { ok: false, message: 'Project ID is required' } as any;
    }

    setLoadingStateChange(true);
    setErrorForm('');
    try{
      const response = await changeStateTicket({ state }, id);
      const ticketsResult = await loadTickets!(projectID!);
      if (!ticketsResult.ok) {
        throw new Error(ticketsResult.message);
      }
      if(response.ok){
        setExitMessage && setExitMessage('Estado del ticket actualizado correctamente');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to change ticket state';
      setErrorForm(message);
      openAlert();
    }finally{
      setLoadingStateChange(false);
    }
  };
  const resetForm = () => {
    setErrorForm(null);
    setLoadingForm(false);
    setLoadingStateChange(false);
    setForm(formTicket);
  };

  const data: TicketFormContextType = {
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
};

export const useTicketFormContext = (): TicketFormContextType => {
  const ctx = React.useContext(TicketFormContext);
  if (!ctx) throw new Error('useTicketFormContext must be used within TicketFormProvider');
  return ctx;
};

export default TicketFormContext;
