'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Link as LinkIcon, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useSettings } from '@/contexts/SettingsContext';

// Activity Heatmap Component
function ActivityHeatmap() {
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    // Generate 365 days of sample data
    const data = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 25) // Random search count
      });
    }
    setHeatmapData(data);
  }, []);

  const getIntensityColor = (count) => {
    if (count === 0) return 'bg-gray-200 dark:bg-gray-800';
    if (count <= 5) return 'bg-green-200 dark:bg-green-900';
    if (count <= 10) return 'bg-green-400 dark:bg-green-700';
    if (count <= 20) return 'bg-green-600 dark:bg-green-500';
    return 'bg-green-800 dark:bg-green-300';
  };

  // Calculate statistics
  const totalSearches = heatmapData.reduce((sum, day) => sum + day.count, 0);
  const dailyAvg = (totalSearches / 365).toFixed(1);
  
  // Calculate current streak
  let currentStreak = 0;
  for (let i = heatmapData.length - 1; i >= 0; i--) {
    if (heatmapData[i].count > 0) {
      currentStreak++;
    } else {
      break;
    }
  }

  return (
    <div className="space-y-6">
      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-grid grid-flow-col gap-[3px]" style={{ gridTemplateRows: 'repeat(7, minmax(0, 1fr))' }}>
          {heatmapData.map((day, idx) => (
            <div
              key={idx}
              className={`w-[10px] h-[10px] rounded-[2px] ${getIntensityColor(day.count)} transition-all cursor-pointer hover:ring-1 hover:ring-primary hover:scale-110`}
              title={`${day.date}: ${day.count} searches`}
            />
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-6">
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-2">Daily avg</p>
          <p className="text-3xl font-bold mb-1">{dailyAvg}</p>
          <p className="text-xs text-muted-foreground">searches</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-2">Current streak</p>
          <p className="text-3xl font-bold mb-1">{currentStreak}</p>
          <p className="text-xs text-muted-foreground">days</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-2">Total searches</p>
          <p className="text-3xl font-bold">{totalSearches.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

export default function AccountTab() {
  const router = useRouter();
  const { closeSettings } = useSettings();
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Get user ID from auth context or generate
    setUserId('dca82b68-408a-4ff4-828a-affcb9ccd720');
  }, []);

  const handleCopyUserId = () => {
    navigator.clipboard.writeText(userId);
    toast.success('User ID copied to clipboard');
  };

  const handleManageAccount = () => {
    closeSettings();
    router.push('/profile');
  };

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Profile Card */}
      <div className="flex items-center gap-5 p-6 rounded-2xl bg-card border border-border/50 hover:border-border transition-colors">
        <Avatar className="w-16 h-16 flex-shrink-0">
          <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-2xl font-bold">
            S
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold truncate">SeFGH</h3>
          <p className="text-sm text-muted-foreground truncate">sefghai@gmail.com</p>
        </div>
        <Button variant="outline" onClick={handleManageAccount} className="flex-shrink-0">
          Manage
        </Button>
      </div>

      {/* SuperGrok Upgrade Card */}
      <div className="flex items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-border/50 hover:border-border transition-colors">
        <div className="flex items-center gap-4 min-w-0">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 flex-shrink-0">
            <Zap className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-semibold truncate">Get SuperGrok</h3>
            <p className="text-sm text-muted-foreground truncate">Unlock advanced features</p>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white flex-shrink-0 shadow-md">
          Upgrade
        </Button>
      </div>

      {/* X Account Integration */}
      <div className="flex items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-border/50 hover:border-border transition-colors">
        <div className="flex items-center gap-4 min-w-0">
          <div className="p-2.5 rounded-xl bg-muted/50 flex-shrink-0">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="text-base font-semibold truncate">X Account</h3>
            <LinkIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          </div>
        </div>
        <Button variant="outline" className="flex-shrink-0">Connect</Button>
      </div>

      {/* Activity Heatmap */}
      <div className="p-6 rounded-2xl bg-card border border-border/50">
        <h3 className="text-base font-semibold mb-5">Activity</h3>
        <ActivityHeatmap />
      </div>

      {/* User ID */}
      <div className="p-5 bg-muted/30 dark:bg-muted/20 rounded-xl border border-border/30">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground mb-2">User ID</p>
            <p className="text-xs font-mono text-foreground/80 select-all break-all leading-relaxed">{userId}</p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopyUserId}
            className="flex-shrink-0 h-8 w-8 p-0"
            aria-label="Copy User ID"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
