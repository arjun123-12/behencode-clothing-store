'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 cursor-pointer"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 select-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="w-full max-w-lg bg-background border border-border-custom p-6 rounded-3xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border-custom/50 pb-4 mb-4 flex-shrink-0">
                <h3 className="font-playfair text-lg font-bold text-foreground">
                  {title || 'Dialog'}
                </h3>
                <button
                  onClick={onClose}
                  className="text-foreground hover:text-rose transition-colors p-1 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto pr-1">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
