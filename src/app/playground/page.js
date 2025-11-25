'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import ApiKeysTab from '@/components/playground/ApiKeysTab';
import UsageTab from '@/components/playground/UsageTab';
import LimitsTab from '@/components/playground/LimitsTab';
import MonitoringTab from '@/components/playground/MonitoringTab';
import TestingTab from '@/components/playground/TestingTab';
import { Activity, Key, Settings, LineChart, TestTube, ArrowLeft } from 'lucide-react';

export default function PlaygroundPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('keys');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-4xl font-bold mb-2">API Playground</h1>
        <p className="text-muted-foreground">
          Manage your API keys, monitor usage, set limits, and test endpoints
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="keys" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">API Keys</span>
          </TabsTrigger>
          <TabsTrigger value="usage" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            <span className="hidden sm:inline">Usage</span>
          </TabsTrigger>
          <TabsTrigger value="limits" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Limits</span>
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Monitor</span>
          </TabsTrigger>
          <TabsTrigger value="testing" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            <span className="hidden sm:inline">Testing</span>
          </TabsTrigger>
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
