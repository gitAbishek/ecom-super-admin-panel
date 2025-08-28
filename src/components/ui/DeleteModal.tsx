import React, { useRef, useEffect } from "react";
import { Button } from "./button";

interface DeleteModalProps {
  visible: boolean;
  isPending?: boolean;
  onClose: () => void;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: () => void;
  title: string;
  description?: string;
}

// Simple fade/slide transition using Tailwind and inline style
type TransitionProps = {
  show: boolean;
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
};
function Transition({ show, children, className = "", ...props }: TransitionProps) {
  return (
    <div
      className={
        `${className} transition-all duration-200 ease-in-out ` +
        (show
          ? "opacity-100 scale-100 pointer-events-auto"
          : "opacity-0 scale-95 pointer-events-none")
      }
      style={{
        transitionProperty: "opacity, transform",
      }}
      {...props}
    >
      {children}
    </div>
  );
}

// Custom hook for click outside (from user snippet)
const useClickOutside = (ref: React.RefObject<HTMLDivElement>, visible: boolean, setVisible: React.Dispatch<React.SetStateAction<boolean>>) => {
  useEffect(() => {
    if (!visible) return;
    
    const clickHandler = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setVisible(false);
      }
    };
    
    // Use timeout to avoid immediate trigger on the same click that opened the modal
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', clickHandler);
    }, 0);
    
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', clickHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setVisible, visible]);
};

const DeleteModal: React.FC<DeleteModalProps> = ({
  visible,
  onClose,
  setVisible,
  handleDelete,
  title,
  description,
  isPending,
}) => {
  const modalContent = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  useClickOutside(modalContent, visible, setVisible);

  return (
    <>
      {/* Overlay */}
      <Transition
        show={visible}
        className="fixed bg-slate-900 bg-opacity-30 z-50"
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh',
          margin: 0,
          padding: 0
        }}
        aria-hidden="true"
      >
        <></>
      </Transition>

      {/* Modal */}
      <Transition
        show={visible}
        className="fixed z-[100] flex items-center justify-center p-4"
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh',
          margin: 0,
          padding: '1rem'
        }}
        role="dialog"
        aria-modal="true"
      >
        <div
          ref={modalContent}
          className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 max-w-md w-full rounded-xl shadow-xl overflow-hidden m-auto"
        >
          <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <button
              type="button"
              className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={onClose}
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          {description && (
            <div className="px-5 pt-4 pb-2 text-gray-600 dark:text-gray-300 text-sm">
              {description}
            </div>
          )}
          <div className="p-5 border-t border-gray-100 dark:border-gray-700">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : title}
            </Button>
          </div>
        </div>
      </Transition>
    </>
  );
};

export default DeleteModal;
