"use client";

import { useEffect, useRef } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title = "Are you sure?",
  description,
  confirmText = "Yes",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // 👆 Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50">
      
      <div
        ref={modalRef}
        className="
          w-full sm:w-96
          bg-white
          rounded-t-2xl sm:rounded-xl
          p-4 sm:p-6
          shadow-lg
          transform transition-all duration-200
          scale-95 opacity-0 animate-modalIn
        "
      >
        {/* 💻 Desktop Header with icon */}
        <div className="hidden sm:flex items-center gap-3 mb-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 text-red-600 text-lg">
            ⚠️
          </div>
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>

        {/* 📱 Mobile title */}
        <h2 className="sm:hidden text-base font-semibold mb-2">
          {title}
        </h2>

        {description && (
          <p className="text-xs sm:text-sm text-gray-600 mb-4">
            {description}
          </p>
        )}

        <div className="flex justify-end gap-2 sm:gap-3">
          
          <button
            onClick={onCancel}
            className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            {confirmText}
          </button>

        </div>
      </div>
    </div>
  );
}