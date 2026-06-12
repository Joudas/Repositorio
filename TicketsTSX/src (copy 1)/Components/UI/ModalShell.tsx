import React from 'react';
import IconClose from './IconClose';

const ModalShell = ({ closeModal, children, panelClassName = '' }) => {
  return (
    <div className='absolute bg-container-modal min-w-full min-h-full flex top-0 justify-center items-center z-1' onClick={closeModal}>
      <div className={`relative ${panelClassName}`} onClick={(e) => e.stopPropagation()}>
        <button type='button' onClick={closeModal} className='absolute cursor-pointer top-2 right-2 items-center justify-center flex w-6 h-6'>
          <IconClose />
        </button>
        {children}
      </div>
    </div>
  );
};

export default ModalShell;