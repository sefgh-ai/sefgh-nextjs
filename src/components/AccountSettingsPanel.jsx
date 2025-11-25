'use client';

import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import GeneralDetailsTab from './account-settings/GeneralDetailsTab';
import UserPermissionTab from './account-settings/UserPermissionTab';
import SharePrivacyTab from './account-settings/SharePrivacyTab';
import BillingTab from './account-settings/BillingTab';
import PaymentsTab from './account-settings/PaymentsTab';
import PlansTab from './account-settings/PlansTab';
import NotificationTab from './account-settings/NotificationTab';
import DomainTab from './account-settings/DomainTab';
import LanguageTab from './account-settings/LanguageTab';
import { Button } from './ui/button';

const accountTabs = [
  { id: 'general', label: 'General Details', completed: true },
  { id: 'permissions', label: 'User Permission', completed: false },
  { id: 'privacy', label: 'Share & Privacy', completed: true },
  { id: 'billing', label: 'Billing', completed: false },
  { id: 'payments', label: 'Payments', completed: false },
  { id: 'plans', label: 'Plans', completed: false },
  { id: 'notification', label: 'Notification', completed: false },
  { id: 'domain', label: 'Domain', completed: false },
  { id: 'language', label: 'Language', completed: false }
];

export default function AccountSettingsPanel({ open, onOpenChange }) {
  const [activeTab, setActiveTab] = useState('general');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Discard them?')) {
        onOpenChange(false);
        setHasUnsavedChanges(false);
      }
    } else {
      onOpenChange(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralDetailsTab onChange={() => setHasUnsavedChanges(true)} />;
      case 'permissions':
        return <UserPermissionTab />;
      case 'privacy':
        return <SharePrivacyTab />;
      case 'billing':
        return <BillingTab />;
      case 'payments':
        return <PaymentsTab />;
      case 'plans':
        return <PlansTab />;
      case 'notification':
        return <NotificationTab />;
      case 'domain':
        return <DomainTab />;
      case 'language':
        return <LanguageTab />;
      default:
        return null;
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-full sm:max-w-4xl p-0 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold">Account Settings</h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 hover:bg-accent/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-1/4 min-w-[200px] bg-muted/30 border-r border-border py-4 overflow-y-auto">
            <nav className="space-y-1">
              {accountTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-accent text-accent-foreground border-l-3 border-primary font-semibold'
                      : 'text-muted-foreground hover:bg-accent/10 hover:text-foreground'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.completed && activeTab === tab.id && (
                    <Check className="w-4 h-4" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-8">
              {renderTabContent()}
            </div>

            {/* Footer */}
            <div className="px-8 py-4 border-t border-border flex justify-end gap-3">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Save logic here
                  setHasUnsavedChanges(false);
                  // Show toast: "Settings saved successfully"
                }}
                disabled={!hasUnsavedChanges}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
