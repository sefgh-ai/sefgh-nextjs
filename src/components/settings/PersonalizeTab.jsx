'use client';

import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const personalities = [
  { value: 'default', label: 'Default', description: 'Balanced and helpful' },
  { value: 'creative', label: 'Creative', description: 'Imaginative and explorative' },
  { value: 'balanced', label: 'Balanced', description: 'Neutral and factual' },
  { value: 'precise', label: 'Precise', description: 'Technical and accurate' }
];

const presets = {
  chatty: "Be conversational and engaging. Ask follow-up questions.",
  witty: "Use humor and clever wordplay when appropriate.",
  straightShooting: "Be direct and concise. No fluff.",
  encouraging: "Be positive and supportive in your responses.",
  genZ: "Use modern slang and casual tone.",
  professional: "Maintain formal, business-appropriate tone.",
  friendly: "Be warm, approachable, and empathetic.",
  concise: "Keep responses short and to the point."
};

const presetLabels = [
  { key: 'chatty', label: 'Chatty' },
  { key: 'witty', label: 'Witty' },
  { key: 'straightShooting', label: 'Straight shooting' },
  { key: 'encouraging', label: 'Encouraging' },
  { key: 'genZ', label: 'Gen Z' },
  { key: 'professional', label: 'Professional' },
  { key: 'friendly', label: 'Friendly' },
  { key: 'concise', label: 'Concise' }
];

export default function PersonalizeTab() {
  const [customizationEnabled, setCustomizationEnabled] = useState(true);
  const [personality, setPersonality] = useState('default');
  const [customInstructions, setCustomInstructions] = useState('');
  const [nickname, setNickname] = useState('');
  const [occupation, setOccupation] = useState('');
  const [interests, setInterests] = useState('');
  const [commStyle, setCommStyle] = useState('casual');
  const [language, setLanguage] = useState('english');

  const handlePresetClick = (key) => {
    setCustomInstructions(prev => prev ? `${prev}\n${presets[key]}` : presets[key]);
  };

  const handleSave = () => {
    toast.success('Preferences saved successfully');
  };

  return (
    <div className="space-y-6">
      {/* Customization Toggle */}
      <div className="flex items-start justify-between gap-4 py-6 border-b border-border">
        <div className="flex-1 max-w-xl">
          <h3 className="text-base font-semibold mb-2">Customization</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-2">
            Enable personalized responses and features.
          </p>
          <a href="#" className="text-sm text-primary hover:underline font-medium">
            Learn more
          </a>
        </div>
        <Switch
          checked={customizationEnabled}
          onCheckedChange={setCustomizationEnabled}
          aria-label="Enable customization"
        />
      </div>

      {/* Personality Selector */}
      <div className="flex items-start justify-between gap-4 py-6 border-b border-border">
        <div className="flex-1 max-w-xl">
          <h3 className="text-base font-semibold mb-2">ChatGPT Personality</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Choose how ChatGPT responds to you.
          </p>
        </div>
        <div className="w-48">
          <Select value={personality} onValueChange={setPersonality}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {personalities.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Custom Instructions */}
      <div className="py-6 border-b border-border">
        <h3 className="text-base font-semibold mb-4">Custom Instructions</h3>
        <div className="space-y-4">
          <div className="relative">
            <Textarea
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="Tell ChatGPT how you'd like it to respond..."
              className="min-h-[120px] text-sm resize-none"
              maxLength={1500}
            />
            <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
              {customInstructions.length} / 1500
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <p className="text-sm font-medium mb-2">Quick presets:</p>
            <div className="flex flex-wrap gap-2">
              {presetLabels.map((preset) => (
                <Badge
                  key={preset.key}
                  variant="outline"
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => handlePresetClick(preset.key)}
                >
                  {preset.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* About You */}
      <div className="py-6">
        <h3 className="text-base font-semibold mb-4">About You</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nickname" className="text-sm font-medium mb-2">
              Nickname
            </Label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="What should we call you?"
              maxLength={50}
            />
          </div>

          <div>
            <Label htmlFor="occupation" className="text-sm font-medium mb-2">
              Occupation
            </Label>
            <Input
              id="occupation"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder="Your profession or role"
              maxLength={100}
            />
          </div>

          <div className="col-span-2">
            <Label htmlFor="interests" className="text-sm font-medium mb-2">
              Interests
            </Label>
            <Textarea
              id="interests"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="What are you interested in?"
              className="min-h-[80px] resize-none"
              maxLength={500}
            />
          </div>

          <div>
            <Label htmlFor="commStyle" className="text-sm font-medium mb-2">
              Communication Style
            </Label>
            <Select value={commStyle} onValueChange={setCommStyle}>
              <SelectTrigger id="commStyle">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="simple">Simple</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="language" className="text-sm font-medium mb-2">
              Preferred Language
            </Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="german">German</SelectItem>
                <SelectItem value="chinese">Chinese</SelectItem>
                <SelectItem value="japanese">Japanese</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button className="mt-6" onClick={handleSave}>
          Save preferences
        </Button>
      </div>
    </div>
  );
}
