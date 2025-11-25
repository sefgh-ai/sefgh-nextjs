'use client';

import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const notificationSettings = [
  {
    id: 'responses',
    title: 'Responses',
    description: 'Get notified when ChatGPT responds to requests that take time, like research or image generation.',
    options: [
      { value: 'push', label: 'Push' },
      { value: 'email', label: 'Email' },
      { value: 'off', label: 'Off' }
    ],
    defaultValue: 'push'
  },
  {
    id: 'tasks',
    title: 'Tasks',
    description: 'Get notified when tasks you\'ve created have updates.',
    link: { text: 'Manage tasks', href: '#' },
    options: [
      { value: 'push-email', label: 'Push, Email' },
      { value: 'push', label: 'Push' },
      { value: 'email', label: 'Email' },
      { value: 'off', label: 'Off' }
    ],
    defaultValue: 'push-email'
  }
];

export default function NotificationsTab() {
  const [settings, setSettings] = useState(
    notificationSettings.reduce((acc, setting) => {
      acc[setting.id] = setting.defaultValue;
      return acc;
    }, {})
  );

  const handleChange = (id, value) => {
    setSettings(prev => ({ ...prev, [id]: value }));
    toast.success('Notification preferences updated');
  };

  return (
    <div className="space-y-0">
      {notificationSettings.map((setting, idx) => (
        <div
          key={setting.id}
          className={`flex items-start justify-between gap-4 py-6 ${
            idx !== notificationSettings.length - 1 ? 'border-b border-border' : ''
          }`}
        >
          <div className="flex-1 max-w-xl">
            <h3 className="text-base font-semibold mb-2">{setting.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {setting.description}
            </p>
            {setting.link && (
              <a
                href={setting.link.href}
                className="inline-block mt-2 text-sm font-medium text-primary hover:underline"
              >
                {setting.link.text}
              </a>
            )}
          </div>
          <div className="w-48">
            <Select
              value={settings[setting.id]}
              onValueChange={(value) => handleChange(setting.id, value)}
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {setting.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ))}
    </div>
  );
}
