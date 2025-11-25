'use client';

import React, { useState, useEffect } from 'react';
import { X, User, Bell, Shield, Monitor, Palette, Database, Flag } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { useSettings } from '@/contexts/SettingsContext';
import AccountTab from './settings/AccountTab';
import NotificationsTab from './settings/NotificationsTab';
import SecurityTab from './settings/SecurityTab';
import SessionsTab from './settings/SessionsTab';
import PersonalizeTab from './settings/PersonalizeTab';
import DataControlsTab from './settings/DataControlsTab';
import ReportIssueTab from './settings/ReportIssueTab';

const settingsTabs = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'sessions', label: 'Sessions', icon: Monitor },
  { id: 'personalize', label: 'Personalize', icon: Palette },
  { id: 'data', label: 'Data Controls', icon: Database },
  { id: 'report', label: 'Report Issue', icon: Flag }
];

export default function SettingsModal() {
  const { settingsModalOpen, setSettingsModalOpen } = useSettings();
  const [activeTab, setActiveTab] = useState('account');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && settingsModalOpen) {
        setSettingsModalOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault();
        setSettingsModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settingsModalOpen, setSettingsModalOpen]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return <AccountTab />;
      case 'notifications':
        return <NotificationsTab />;
      case 'security':
        return <SecurityTab />;
      case 'sessions':
        return <SessionsTab />;
      case 'personalize':
        return <PersonalizeTab />;
      case 'data':
        return <DataControlsTab />;
      case 'report':
        return <ReportIssueTab />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={settingsModalOpen} onOpenChange={setSettingsModalOpen}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 gap-0 [&>button]:hidden">
        <VisuallyHidden>
          <DialogTitle>Settings</DialogTitle>
        </VisuallyHidden>
        <div className="flex h-full overflow-hidden">
          {/* Sidebar */}
          <div className="w-56 flex-shrink-0 bg-muted/40 dark:bg-muted/20 border-r p-5">
            <div className="mb-6">
              <h2 className="text-lg font-bold px-2">Settings</h2>
            </div>
            <nav className="space-y-1.5">
              {settingsTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary/10 text-primary font-medium border-l-2 border-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b flex-shrink-0">
              <h3 className="text-2xl font-bold">
                {settingsTabs.find(t => t.id === activeTab)?.label}
              </h3>
              <button
                onClick={() => setSettingsModalOpen(false)}
                className="rounded-full p-2 hover:bg-muted transition-colors"
                aria-label="Close settings"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
