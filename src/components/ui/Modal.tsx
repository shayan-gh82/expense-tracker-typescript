import type { ReactNode } from "react";
import { X } from "lucide-react";
import Button from "./Button";

interface ModalProps {
  isOpen: boolean;
  title: string;
  children?: ReactNode;
  onClose: () => void;
}

const Modal = ({ isOpen, title, children, onClose }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="glass-card max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-royal-text">{title}</h2>
          <Button variant="ghost" className="!p-2" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
