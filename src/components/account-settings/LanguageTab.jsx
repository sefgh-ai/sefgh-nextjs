'use client';

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish (Español)' },
  { value: 'fr', label: 'French (Français)' },
  { value: 'de', label: 'German (Deutsch)' },
  { value: 'it', label: 'Italian (Italiano)' },
  { value: 'pt', label: 'Portuguese (Português)' },
  { value: 'ru', label: 'Russian (Русский)' },
  { value: 'ja', label: 'Japanese (日本語)' },
  { value: 'ko', label: 'Korean (한국어)' },
  { value: 'zh', label: 'Chinese (中文)' },
  { value: 'ar', label: 'Arabic (العربية)' },
  { value: 'hi', label: 'Hindi (हिन्दी)' }
];

const dateFormats = [
  { value: 'mdy', label: 'MM/DD/YYYY' },
  { value: 'dmy', label: 'DD/MM/YYYY' },
  { value: 'ymd', label: 'YYYY-MM-DD' }
];

const timeFormats = [
  { value: '12', label: '12-hour (AM/PM)' },
  { value: '24', label: '24-hour' }
];

export default function LanguageTab() {
  const [language, setLanguage] = useState('en');
  const [dateFormat, setDateFormat] = useState('mdy');
  const [timeFormat, setTimeFormat] = useState('12');

  const handleSave = () => {
    toast.success('Language preferences saved');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Language & Region</h3>
        <p className="text-sm text-muted-foreground">
          Customize your language and regional preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* Language Selection */}
        <div>
          <Label htmlFor="language" className="text-sm font-medium mb-2">
            Display Language
          </Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger id="language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-2">
            The language used throughout the interface.
          </p>
        </div>

        {/* Date Format */}
        <div>
          <Label htmlFor="dateFormat" className="text-sm font-medium mb-2">
            Date Format
          </Label>
          <Select value={dateFormat} onValueChange={setDateFormat}>
            <SelectTrigger id="dateFormat">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dateFormats.map((format) => (
                <SelectItem key={format.value} value={format.value}>
                  {format.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Time Format */}
        <div>
          <Label htmlFor="timeFormat" className="text-sm font-medium mb-2">
            Time Format
          </Label>
          <Select value={timeFormat} onValueChange={setTimeFormat}>
            <SelectTrigger id="timeFormat">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeFormats.map((format) => (
                <SelectItem key={format.value} value={format.value}>
                  {format.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Preview */}
        <div className="p-5 bg-muted/30 border border-border rounded-xl">
          <h4 className="text-sm font-medium mb-3">Preview</h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Date: </span>
              <span className="font-medium">
                {dateFormat === 'mdy' && '11/02/2025'}
                {dateFormat === 'dmy' && '02/11/2025'}
                {dateFormat === 'ymd' && '2025-11-02'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Time: </span>
              <span className="font-medium">
                {timeFormat === '12' ? '3:45 PM' : '15:45'}
              </span>
            </div>
          </div>
        </div>

        <Button onClick={handleSave}>Save Preferences</Button>
      </div>
    </div>
  );
}
