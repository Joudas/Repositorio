import { createPortal } from "react-dom";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isCreating: boolean;
}

export default function DoingPrompt({ isOpen, onClose, onConfirm, isCreating }: Props) {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-gray-6 rounded-xl p-6 shadow-2xl border border-gray-5 w-96">
        <h2 className="text-gray-1 font-semibold text-lg mb-1">⚡ Zen Mode</h2>
        <p className="text-gray-2 mb-6 mt-4">
          ¿Quieres crear una card Doing para el modo Zen?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isCreating}
            className="px-4 py-2 rounded-md text-gray-3 hover:text-gray-1 hover:bg-gray-5 cursor-pointer disabled:opacity-50"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            disabled={isCreating}
            className="px-4 py-2 rounded-md bg-brand-primary text-white hover:opacity-90 cursor-pointer disabled:opacity-50"
          >
            {isCreating ? "Creando..." : "Sí, crear"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
