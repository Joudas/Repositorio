import { useTickets } from '../context/TicketContext';

export const NotesPanel = ({ openModal } : {openModal: (modal: string, payload?: unknown) => void}) => {
    const {notes} = useTickets();
    
  return (
    <>
        <div className="mt-10 flex w-full border-b border-gray-200 pb-4">
            <div className="w-full flex flex-col gap-2">
                <div className="flex justify-between items-center h-10 shrink-0">
                    <p className="font-semibold text-lg">Notes</p>
                    <button
                    onClick={() => openModal('note')}
                    className='border-b px-2 border-brand text-brand cursor-pointer'>Add Note</button>
                </div>
                <div className='flex w-full h-60 gap-8 overflow-x-auto overflow-y-hidden pb-4 mb-2 mx-2'>
                    {notes.length > 0 ? notes.map(note => (
                        <div key={note.id} className="bg-notes text-sm rounded-sm p-4 h-full max-w-60 w-full shrink-0 wrap-break-word">
                        <div className="text-xs text-gray-400 mb-2">
                            {note.created_at ? new Date(note.created_at).toLocaleDateString() : ''}  
                        </div>
                        <div>
                            {note.note}
                        </div>
                        
                        </div>
                    )) : <div className="wrap-break-word max-w-full text-sm mt-2">Sin notas</div>}
                </div>
            </div>
        </div>
    </>
  )
}
