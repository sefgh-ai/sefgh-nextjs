'use client';

import React, { useState } from 'react';
import { Paperclip, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

export default function GeneralDetailsTab({ onChange }) {
  const [firstName, setFirstName] = useState('Florence');
  const [lastName, setLastName] = useState('Shaw');
  const [email, setEmail] = useState('florence@sefgh.ai');
  const [username, setUsername] = useState('florence_shaw');
  const [bio, setBio] = useState('');
  const [timezone, setTimezone] = useState('pst');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleChange = (setter) => (value) => {
    setter(value);
    onChange();
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    const validTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large (max 5MB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarUrl(e.target.result);
      onChange();
      toast.success('Avatar updated');
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteAvatar = () => {
    setAvatarUrl('');
    onChange();
    toast.success('Avatar deleted');
  };

  return (
    <div className="space-y-8">
      {/* Personal Information */}
      <div>
        <h3 className="text-lg font-semibold mb-6">Personal Information</h3>
        
        <div className="grid grid-cols-2 gap-4">
          {/* First Name & Last Name */}
          <div>
            <Label htmlFor="firstName" className="text-sm font-medium mb-2">
              First Name
            </Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => handleChange(setFirstName)(e.target.value)}
              placeholder="First name"
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="text-sm font-medium mb-2">
              Last Name
            </Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => handleChange(setLastName)(e.target.value)}
              placeholder="Last name"
            />
          </div>

          {/* Email */}
          <div className="col-span-2">
            <Label htmlFor="email" className="text-sm font-medium mb-2">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => handleChange(setEmail)(e.target.value)}
              placeholder="email@example.com"
            />
          </div>

          {/* Username */}
          <div className="col-span-2">
            <Label htmlFor="username" className="text-sm font-medium mb-2">
              Username
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                Workstation.com/
              </span>
              <Input
                id="username"
                value={username}
                onChange={(e) => handleChange(setUsername)(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                placeholder="username"
                className="flex-1"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="col-span-2">
            <Label htmlFor="bio" className="text-sm font-medium mb-2">
              Bio
            </Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => handleChange(setBio)(e.target.value)}
              placeholder="Tell us about yourself..."
              className="min-h-[120px] resize-none"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {bio.length} / 500
            </p>
          </div>

          {/* Timezone */}
          <div className="col-span-2">
            <Label htmlFor="timezone" className="text-sm font-medium mb-2">
              Timezone
            </Label>
            <Select value={timezone} onValueChange={handleChange(setTimezone)}>
              <SelectTrigger id="timezone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                <SelectItem value="cet">Central European Time (CET)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Avatar Section */}
      <div>
        <h3 className="text-lg font-semibold mb-6">Avatar</h3>
        
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-16 h-16">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt="Avatar" />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white text-2xl font-bold">
                {firstName[0]}{lastName[0]}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <label htmlFor="avatar-upload" className="cursor-pointer">
                Edit Photo
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={handleDeleteAvatar}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Upload Area */}
        <div>
          <Label className="text-sm font-medium mb-2">Upload Photo</Label>
          <div
            className={`relative h-32 border-2 border-dashed rounded-xl transition-colors ${
              dragActive
                ? 'border-primary bg-primary/10'
                : 'border-border bg-muted/30'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <Paperclip className="w-6 h-6 text-muted-foreground mb-2" />
              <p className="text-sm font-medium text-foreground">
                📎 Drag and drop or click to upload
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                SVG, PNG, JPG or GIF (max. 800x400px)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
