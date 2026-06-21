import type { TicketDetailProps } from '../types';
import { TicketActions, TicketButton } from './TicketActions';


export const TicketDetails = ({ priorityMap, statesMap, actualTicket, stateTicket, openModal }: TicketDetailProps) => {
    const priority = actualTicket?.priority as keyof typeof priorityMap | undefined;
    const colorPriority = priority ? priorityMap[priority] : { state: '', css: '', color: 'bg-gray-400' };
    const stateKey = actualTicket?.state as keyof typeof statesMap | undefined;
    const colorState = stateKey ? statesMap[stateKey] : { state: '', label: '', next: '', css: '', border: 'border-yellow-500', text: 'text-yellow-500' };
    const ticketDate = actualTicket?.created_at || actualTicket?.createDate || actualTicket?.createdAt || '';

  return (
    <>
        <div className='w-full border-b border-gray-200 pb-4'>
            <div className="flex items-center h-10 mb-6 w-full">
                <div className="flex w-[80%] gap-2">
                    <div className="font-bold text-3xl min-w-0">{actualTicket?.name || ''}</div>
                    <TicketActions actualTicket={actualTicket} openModal={openModal} />
                </div>
                <TicketButton actualTicket={actualTicket} stateTicket={stateTicket} />
                {/* <div className={`p-[0.5px] rounded-md border-2 ${colorState.border} w-30 ${colorState.text} font-semibold text-center`}>{colorState.label || 'Pending'}</div> */}
            </div>
            <div className="flex justify-start items-center gap-6">
                <div className="flex justify-center items-center">
                    <svg width='24px' height='24px' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 9H21M7 3V5M17 3V5M10 14L12 12M12 12L14 14M12 12V18M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                    <span className="font-medium text-black">{ticketDate ? new Date(ticketDate).toLocaleDateString() : 'Sin fecha'}</span>
                </div>
                <div className="flex justify-center items-center">
                    <span className={`flex w-2 h-2 ${colorPriority.css} rounded-full mr-2`}></span> 
                    <span className="font-medium text-black">{colorPriority.state}</span>
                </div>
                <div className="flex justify-center items-center">
                    <span className={`p-[0.5px] w-30 flex items-center gap-1 font-semibold text-center`}> 
                        <p className={`${colorState.css} w-2 h-2 rounded-full`}>
                        </p> 
                        <span className="font-medium text-black">{colorState.state}</span>
                    </span>
                </div>
            </div>
        </div>
        <div className="mt-10 flex w-full border-b border-gray-200 pb-4">
            <div className="min-w-0 grid grid-rows-2 gap-1">
                <p className="font-semibold text-lg">Description</p>
                <div className="wrap-break-word max-w-full text-sm mt-2">{actualTicket?.description || 'Sin descripción'}</div>
            </div>
        </div>
    </>
  )
}
