'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { PageLoadingSpinner } from '@/components/shared/PageLoadingSpinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ApiKeysTab from '@/components/playground/ApiKeysTab';
import UsageTab from '@/components/playground/UsageTab';
import LimitsTab from '@/components/playground/LimitsTab';
import MonitoringTab from '@/components/playground/MonitoringTab';
import TestingTab from '@/components/playground/TestingTab';
import PlaygroundHeader from './components/PlaygroundHeader';
import { playgroundTabs } from './utils/tabConfig';

export default function PlaygroundPage() {
  const { user } = useAuth();
  const { isAuthenticated, isLoading } = useAuthGuard();
  const [activeTab, setActiveTab] = useState('keys');

  if (isLoading) {
    return <PageLoadingSpinner />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <PlaygroundHeader />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          {playgroundTabs.map(({ value, label, icon: Icon }) => (
            <TabsTrigger key={value} value={value} className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="keys" className="space-y-4">
          <ApiKeysTab userId={user.id} />
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <UsageTab userId={user.id} />
        </TabsContent>

        <TabsContent value="limits" className="space-y-4">
          <LimitsTab userId={user.id} />
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <MonitoringTab userId={user.id} />
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <TestingTab userId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
