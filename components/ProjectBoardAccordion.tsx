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
        className="theme-card flex w-full cursor-pointer items-center justify-between rounded-2xl border px-5 py-4 shadow-[var(--glass-shadow)] transition-colors hover:bg-[color:var(--surface-card-strong)]"
      >
        <span className="flex items-center gap-2 font-medium text-mk-text">
          <span>📌</span>
          Board / References
        </span>
        <div className="flex items-center gap-3">
          {/* Edit Button - Circle Pictogram */}
          <button
            type="button"
            onClick={handleEditClick}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
              isEditMode 
                ? 'bg-accent-cyan text-white shadow-lg shadow-accent-cyan/30' 
                : 'bg-[color:var(--surface-card)] text-mk-text-muted hover:bg-[color:var(--surface-card-strong)] hover:text-mk-text'
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
            className={`text-sm text-mk-text-muted transition-transform duration-200 ${
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
            <div className="theme-card overflow-hidden rounded-[20px] border shadow-[var(--glass-shadow)]">
              {/* Edit mode indicator */}
              {isEditMode && (
                <div className="flex items-center justify-between border-b border-[rgba(79,209,197,0.2)] bg-[rgba(79,209,197,0.1)] px-4 py-2">
                  <span className="flex items-center gap-2 text-xs font-medium text-accent-cyan">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-accent-cyan" />
                    Bearbeitungsmodus aktiv
                  </span>
                  <span className="text-xs text-mk-text-muted">
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
            className="theme-card-strong relative w-full max-w-xs rounded-2xl border p-6 shadow-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2 text-center text-lg font-semibold text-mk-text">
              PIN eingeben
            </h3>
            <p className="mb-4 text-center text-sm text-mk-text-secondary">
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
                className={`w-full rounded-xl border-2 bg-[color:var(--surface-card)] px-4 py-3 text-center text-2xl tracking-[0.5em] text-mk-text transition-colors outline-none ${
                  pinError 
                    ? 'border-red-400 bg-red-50 dark:bg-red-950/40' 
                    : 'border-[color:var(--surface-border)] focus:border-accent-cyan'
                }`}
                placeholder="••••"
              />
              {pinError && (
                <p className="mt-2 text-center text-xs text-red-500">
                  Falscher PIN. Bitte erneut versuchen.
                </p>
              )}
            </div>
            
            {/* Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowPinModal(false)}
                className="theme-card flex-1 rounded-xl border py-2.5 text-mk-text-secondary transition-colors hover:bg-[color:var(--surface-card-strong)] hover:text-mk-text"
              >
                Abbrechen
              </button>
              <button
                type="button"
                onClick={handlePinSubmit}
                disabled={pinInput.length !== 4}
                className="flex-1 rounded-xl bg-accent-cyan py-2.5 font-medium text-white transition-colors hover:bg-[#38B2AC] disabled:cursor-not-allowed disabled:opacity-50"
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
