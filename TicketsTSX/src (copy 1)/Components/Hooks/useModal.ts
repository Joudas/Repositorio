import React, {useState} from 'react'

const useModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeModal, setActiveModal] = useState(null)
  const [modalPayload, setModalPayload] = useState(null)

  const openModal = (modal, payload = null) => {
    setIsModalOpen(true);
    setActiveModal(modal);
    setModalPayload(payload);
  }
  const closeModal = () => {
    setIsModalOpen(false);
    setActiveModal(null);
    setModalPayload(null);
  }

  return { isModalOpen, openModal, closeModal, activeModal, modalPayload }
}
export default useModal;