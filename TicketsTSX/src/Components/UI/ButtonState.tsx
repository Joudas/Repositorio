export const ButtonState = ({ actualTicket, stateTicket, loadingStateChange, handleChange }) => {
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
