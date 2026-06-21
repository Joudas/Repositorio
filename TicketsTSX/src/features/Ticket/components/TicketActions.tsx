import IconDelete from '@/Components/Icon/IconDelete';
import IconEdit from '@/Components/Icon/IconEdit';
import { useContext } from 'react';
import TicketContext from '../context/TicketContext';
import useTicket from '@/features/DashBoard/hooks/useTicket';
import { useTicketList } from '../hooks/useTicketList';

export const TicketActions = ({ openModal, actualTicket }) => {
    return (
        <div className="">
            {/* State change button or completed badge */}
            <div className="flex justify-center items-center gap-2">
                <button onClick={() => openModal('edit', actualTicket)} className='flex justify-center items-center gap-2 text-gray-700 px-3 py-1 border border-transparent cursor-pointer rounded-md hover:bg-yellow-500 hover:text-white transition-colors duration-300'>
                    <IconEdit />
                </button>
                <button onClick={() => openModal('delete', actualTicket)} className='flex justify-center items-center gap-2 text-gray-700 px-3 py-1 border border-transparent cursor-pointer rounded-md hover:bg-red-500 hover:text-white transition-colors duration-300'>
                    <IconDelete />
                </button>
            </div>
        </div>
    )
}

export const TicketButton = ({ actualTicket, stateTicket }) => {
<<<<<<< Updated upstream
    const { changeState, loadingStateChange } = useTicketList();
    const handleChange = () => {
        if (!actualTicket) return;
        if (actualTicket.state === 'completed') return;
        console.log(stateTicket.next, actualTicket.id);
        changeState({ state: stateTicket.next, ticketID: String(actualTicket.id) });
=======
    
    const { changeState, loadingStateChange } = useTicketList();
    
    const handleChange = () => {
        if (!actualTicket) return;
            if (actualTicket.state === 'completed') return;
            changeState({ state: String(stateTicket.next), ticketID: String(actualTicket.id) });
>>>>>>> Stashed changes
    }
    return (
        <div>
            {actualTicket?.state === 'completed' ? (
                <div className={`w-48 flex justify-center text-white py-2 px-4 font-semibold rounded-md ${stateTicket.css} opacity-80 cursor-default`}>
                    ✓ {stateTicket.label}
                </div>
            ) : (
                <button
                    onClick={handleChange}
                    disabled={loadingStateChange}
                    className={`${stateTicket.css} w-48 flex justify-center items-center text-white py-2 px-4 font-semibold rounded-md ${loadingStateChange ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    {loadingStateChange ? (
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                            <circle className=" opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                    ) : null}
                    <span>{stateTicket.label}</span>
                </button>
            )}
        </div>
    )
}

