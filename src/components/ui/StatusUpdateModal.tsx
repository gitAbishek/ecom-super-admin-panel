import React, { useRef, useEffect, useState } from "react";
import { Button } from "./button";
import CustomLabel from "@/components/form/CustomLabel";

interface StatusUpdateModalProps {
  visible: boolean;
  isPending?: boolean;
  onClose: () => void;
  handleStatusUpdate: (status: string) => void;
  title: string;
  description?: string;
  currentStatus?: string;
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
        transition: "opacity 200ms ease-in-out, transform 200ms ease-in-out",
      }}
      {...props}
    >
      {children}
    </div>
  );
}

const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  visible,
  isPending,
  onClose,
  handleStatusUpdate,
  title,
  description,
  currentStatus = ""
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "suspended", label: "Suspended" }
  ];

  useEffect(() => {
    if (visible) {
      setSelectedStatus(currentStatus);
    }
  }, [visible, currentStatus]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [visible, onClose]);

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [visible, onClose]);

  const handleSubmit = () => {
    if (selectedStatus && selectedStatus !== currentStatus) {
      handleStatusUpdate(selectedStatus);
    }
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <Transition
        show={visible}
        className="fixed inset-0 bg-black/50 dark:bg-black/70"
      >
        <div onClick={onClose} className="w-full h-full" />
      </Transition>

      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <Transition
          show={visible}
          className="w-full max-w-md transform rounded-lg bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl"
          ref={modalRef}
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h3>
            {description && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>

          <div className="mb-6">
            <CustomLabel htmlFor="status">Select New Status</CustomLabel>
            <select
              id="status"
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 block p-2.5 dark:text-white transition"
            >
              <option value="">Select status</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isPending || !selectedStatus || selectedStatus === currentStatus}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isPending ? "Updating..." : "Update Status"}
            </Button>
          </div>
        </Transition>
      </div>
    </div>
  );
};

export default StatusUpdateModal;
