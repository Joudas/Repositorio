import {useState} from 'react'

const useModalTickets = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [modalPayload, setModalPayload] = useState(null)

  const openModal = (modal: string, payload = null) => {
    setIsModalOpen(true);
    setActiveModal(modal);
    setModalPayload(payload);
  }
  const closeModal = () => {
    setIsModalOpen(false);
    setActiveModal('');
    setModalPayload(null);
  }

  return { isModalOpen, openModal, closeModal, activeModal, modalPayload }
}
export default useModalTickets;