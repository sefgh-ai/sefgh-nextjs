'use client';

import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const notificationSettings = [
  { id: 'email', label: 'Email Notifications', description: 'Receive notifications via email', enabled: true },
  { id: 'push', label: 'Push Notifications', description: 'Receive push notifications in browser', enabled: true },
  { id: 'marketing', label: 'Marketing Emails', description: 'Receive updates about new features', enabled: false },
  { id: 'weekly', label: 'Weekly Summary', description: 'Get a weekly summary of your activity', enabled: true }
];

export default function NotificationTab() {
  const [settings, setSettings] = useState(notificationSettings);
  const [frequency, setFrequency] = useState('instant');

  const handleToggle = (id) => {
    setSettings(prev =>
      prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s)
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Notification Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Manage how you receive notifications.
        </p>
      </div>

      {/* Notification Frequency */}
      <div className="flex items-center justify-between p-5 border border-border rounded-xl bg-card">
        <div>
          <p className="text-sm font-medium">Notification Frequency</p>
          <p className="text-xs text-muted-foreground">How often you want to receive notifications</p>
        </div>
        <Select value={frequency} onValueChange={setFrequency}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="instant">Instant</SelectItem>
            <SelectItem value="hourly">Hourly</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notification Settings */}
      <div className="space-y-1">
        {settings.map((setting, idx) => (
          <div
            key={setting.id}
            className={`flex items-center justify-between p-5 ${
              idx !== settings.length - 1 ? 'border-b border-border' : ''
            }`}
          >
            <div>
              <p className="text-sm font-medium">{setting.label}</p>
              <p className="text-xs text-muted-foreground">{setting.description}</p>
            </div>
            <Switch
              checked={setting.enabled}
              onCheckedChange={() => handleToggle(setting.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
