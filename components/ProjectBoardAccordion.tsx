'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BoardCanvas } from './board/BoardCanvas';

interface ProjectBoardAccordionProps {
  slug: string;
}

// PIN for editing - later this should come from environment or database
const EDIT_PIN = '1991';

export function ProjectBoardAccordion({ slug }: ProjectBoardAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isEditMode) {
      // Already in edit mode, exit it
      setIsEditMode(false);
    } else {
      // Show PIN modal to enter edit mode
      setShowPinModal(true);
      setPinInput('');
      setPinError(false);
    }
  };

  const handlePinSubmit = useCallback(() => {
    if (pinInput === EDIT_PIN) {
      setIsEditMode(true);
      setShowPinModal(false);
      setPinInput('');
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
    }
  }, [pinInput]);

  const handlePinKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePinSubmit();
    } else if (e.key === 'Escape') {
      setShowPinModal(false);
      setPinInput('');
      setPinError(false);
    }
  };

  const handlePinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPinInput(value);
    setPinError(false);
  };

  return (
    <div className="mt-6 relative" style={{ zIndex: 5 }}>
      {/* Header Button */}
      <button
        type="button"
        onClick={handleToggle}
        className="w-full px-5 py-4 bg-[rgba(255,255,255,0.7)] rounded-2xl border border-[rgba(28,28,28,0.08)] cursor-pointer flex items-center justify-between shadow-[0_2px_12px_rgba(28,28,28,0.04)] hover:bg-[rgba(255,255,255,0.85)] transition-colors"
      >
        <span className="text-[#1C1C1C] font-medium flex items-center gap-2">
          <span>📌</span>
          Board / References
        </span>
        <div className="flex items-center gap-3">
          {/* Edit Button - Circle Pictogram */}
          <button
            type="button"
            onClick={handleEditClick}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isEditMode 
                ? 'bg-accent-cyan text-white shadow-lg shadow-accent-cyan/30' 
                : 'bg-[rgba(28,28,28,0.05)] text-[rgba(28,28,28,0.4)] hover:bg-[rgba(28,28,28,0.1)]'
            }`}
            title={isEditMode ? 'Bearbeitung beenden' : 'Bearbeiten (PIN erforderlich)'}
          >
            {/* Pencil Icon */}
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
              />
            </svg>
          </button>
          
          {/* Arrow */}
          <span 
            className={`text-[rgba(28,28,28,0.5)] text-sm transition-transform duration-200 ${
              isOpen ? 'rotate-180' : 'rotate-0'
            }`}
          >
            ▼
          </span>
        </div>
      </button>

      {/* Content Panel with smooth CSS Grid animation */}
      <div 
        className="grid transition-all duration-300 ease-out"
        style={{ 
          gridTemplateRows: isOpen ? '1fr' : '0fr',
          marginTop: isOpen ? 12 : 0,
        }}
      >
        <div className="overflow-hidden">
          <motion.div
            initial={false}
            animate={{ 
              opacity: isOpen ? 1 : 0,
              scale: isOpen ? 1 : 0.98,
            }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div
              className="rounded-[20px] border border-[rgba(28,28,28,0.06)] shadow-[0_4px_24px_rgba(28,28,28,0.05)] overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.6)',
              }}
            >
              {/* Edit mode indicator */}
              {isEditMode && (
                <div className="px-4 py-2 bg-[rgba(79,209,197,0.1)] border-b border-[rgba(79,209,197,0.2)] flex items-center justify-between">
                  <span className="text-xs font-medium text-accent-cyan flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
                    Bearbeitungsmodus aktiv
                  </span>
                  <span className="text-xs text-[rgba(28,28,28,0.5)]">
                    Dateien hierher ziehen • Space + Drag zum Bewegen
                  </span>
                </div>
              )}
              
              {/* Board Canvas */}
              <div className="p-4">
                <BoardCanvas slug={slug} isEditMode={isEditMode} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* PIN Modal */}
      {showPinModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={() => setShowPinModal(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          
          {/* Modal */}
          <div 
            className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xs mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-[#1C1C1C] mb-2 text-center">
              PIN eingeben
            </h3>
            <p className="text-sm text-[rgba(28,28,28,0.6)] mb-4 text-center">
              Zum Bearbeiten 4-stelligen PIN eingeben
            </p>
            
            {/* PIN Input */}
            <div className="relative mb-4">
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                value={pinInput}
                onChange={handlePinInputChange}
                onKeyDown={handlePinKeyDown}
                autoFocus
                className={`w-full text-center text-2xl tracking-[0.5em] py-3 px-4 rounded-xl border-2 transition-colors ${
                  pinError 
                    ? 'border-red-400 bg-red-50' 
                    : 'border-[rgba(28,28,28,0.15)] focus:border-accent-cyan'
                } outline-none`}
                placeholder="••••"
              />
              {pinError && (
                <p className="text-red-500 text-xs mt-2 text-center">
                  Falscher PIN. Bitte erneut versuchen.
                </p>
              )}
            </div>
            
            {/* Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowPinModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-[rgba(28,28,28,0.15)] text-[rgba(28,28,28,0.7)] hover:bg-[rgba(28,28,28,0.05)] transition-colors"
              >
                Abbrechen
              </button>
              <button
                type="button"
                onClick={handlePinSubmit}
                disabled={pinInput.length !== 4}
                className="flex-1 py-2.5 rounded-xl bg-accent-cyan text-white font-medium hover:bg-[#38B2AC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Bestätigen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
