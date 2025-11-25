'use client';

import React, { createContext, useContext, useState } from 'react';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const openSettings = () => setSettingsModalOpen(true);
  const closeSettings = () => setSettingsModalOpen(false);
  const toggleSettings = () => setSettingsModalOpen(prev => !prev);

  return (
    <SettingsContext.Provider
      value={{
        settingsModalOpen,
        setSettingsModalOpen,
        openSettings,
        closeSettings,
        toggleSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
