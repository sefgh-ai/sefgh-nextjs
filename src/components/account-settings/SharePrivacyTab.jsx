'use client';

import React, { useState } from 'react';
import { Link as LinkIcon, Copy, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const invitedUsers = [
  { id: 1, name: 'Esther Howard', email: 'esther@example.com', status: 'Invited' },
  { id: 2, name: 'Kristin Watson', email: 'kristin@example.com', status: 'Invited' },
  { id: 3, name: 'Kathryn Murphy', email: 'kathryn@example.com', status: 'Invited' }
];

export default function SharePrivacyTab() {
  const [activeSubTab, setActiveSubTab] = useState('share');
  const [privacyLevel, setPrivacyLevel] = useState('invited');
  const [searchIndexing, setSearchIndexing] = useState(false);
  const [dataSharing, setDataSharing] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  const [autoPublish, setAutoPublish] = useState(false);
  const [publishTiming, setPublishTiming] = useState('immediate');

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://websitename.com');
    toast.success('Link copied to clipboard');
  };

  const handleInvite = () => {
    toast.success('Invitation sent');
  };

  const generatePrivateLink = () => {
    toast.success('Private invite link generated and copied');
  };

  return (
    <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-6">
        <TabsTrigger value="share">Share</TabsTrigger>
        <TabsTrigger value="privacy">Privacy</TabsTrigger>
        <TabsTrigger value="publishing">Publishing</TabsTrigger>
        <TabsTrigger value="domain">Domain</TabsTrigger>
      </TabsList>

      {/* Share Sub-tab */}
      <TabsContent value="share" className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Share Your Workspace</h3>
          
          <div className="flex items-center gap-6 p-5 border border-border rounded-xl bg-card">
            {/* QR Code */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 border border-border rounded-lg bg-white flex items-center justify-center p-3">
                <QrCode className="w-full h-full text-foreground" />
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2">16×16</p>
            </div>

            {/* Domain Info */}
            <div className="flex-1">
              <p className="text-lg font-semibold mb-3">websitename.com</p>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleCopyLink}>
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            </div>
          </div>

          {/* Custom Domain */}
          <div className="mt-4 p-4 bg-muted/50 border border-border rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👑</span>
              <span className="text-sm font-medium">Custom Domain</span>
              <span className="text-xs text-muted-foreground">Available on paid plans</span>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
        </div>

        {/* Invite Users */}
        <div>
          <h3 className="text-base font-semibold mb-4">Invite Users</h3>
          
          <div className="flex gap-3 mb-4">
            <Input placeholder="email@example.com" className="flex-1" />
            <Button onClick={handleInvite}>Send Invite</Button>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Invited users will receive a magic link to join.
          </p>

          {/* Invited Users List */}
          <div className="border border-border rounded-lg overflow-hidden mb-4">
            {invitedUsers.map((user, idx) => (
              <div
                key={user.id}
                className={`flex items-center justify-between p-4 ${
                  idx !== invitedUsers.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Badge variant="secondary">{user.status}</Badge>
              </div>
            ))}
          </div>

          <Button variant="outline" onClick={generatePrivateLink}>
            Get private invite link
          </Button>
        </div>
      </TabsContent>

      {/* Privacy Sub-tab */}
      <TabsContent value="privacy" className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-3 block">Who can view your workspace:</Label>
              <RadioGroup value={privacyLevel} onValueChange={setPrivacyLevel}>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="anyone" id="anyone" />
                  <Label htmlFor="anyone" className="font-normal cursor-pointer">
                    Anyone with the link
                  </Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="invited" id="invited" />
                  <Label htmlFor="invited" className="font-normal cursor-pointer">
                    Only invited users
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="me" id="me" />
                  <Label htmlFor="me" className="font-normal cursor-pointer">
                    Only me
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center justify-between py-4 border-t border-border">
              <div>
                <p className="text-sm font-medium">Search Engine Indexing</p>
                <p className="text-xs text-muted-foreground">Allow search engines to index your workspace.</p>
              </div>
              <Switch checked={searchIndexing} onCheckedChange={setSearchIndexing} />
            </div>

            <div className="flex items-center justify-between py-4 border-t border-border">
              <div>
                <p className="text-sm font-medium">Data Sharing</p>
                <p className="text-xs text-muted-foreground">Share usage data to improve our services.</p>
              </div>
              <Switch checked={dataSharing} onCheckedChange={setDataSharing} />
            </div>

            <div className="flex items-center justify-between py-4 border-t border-border">
              <div>
                <p className="text-sm font-medium">Analytics</p>
                <p className="text-xs text-muted-foreground">Enable analytics tracking for your workspace.</p>
              </div>
              <Switch checked={analytics} onCheckedChange={setAnalytics} />
            </div>
          </div>
        </div>
      </TabsContent>

      {/* Publishing Sub-tab */}
      <TabsContent value="publishing" className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Publishing Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-4">
              <div>
                <p className="text-sm font-medium">Auto-publish</p>
                <p className="text-xs text-muted-foreground">Automatically publish changes when saved.</p>
              </div>
              <Switch checked={autoPublish} onCheckedChange={setAutoPublish} />
            </div>

            <div className="border-t border-border pt-4">
              <Label className="text-sm font-medium mb-3 block">Publishing Schedule:</Label>
              <RadioGroup value={publishTiming} onValueChange={setPublishTiming}>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="immediate" id="immediate" />
                  <Label htmlFor="immediate" className="font-normal cursor-pointer">
                    Publish immediately
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="scheduled" id="scheduled" />
                  <Label htmlFor="scheduled" className="font-normal cursor-pointer">
                    Schedule for later
                  </Label>
                </div>
              </RadioGroup>

              {publishTiming === 'scheduled' && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="date" className="text-sm mb-2">Date</Label>
                    <Input id="date" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="time" className="text-sm mb-2">Time</Label>
                    <Input id="time" type="time" />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between py-4 border-t border-border">
              <div>
                <p className="text-sm font-medium">Notification</p>
                <p className="text-xs text-muted-foreground">Notify users when new content is published.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </TabsContent>

      {/* Domain Sub-tab */}
      <TabsContent value="domain" className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Custom Domain</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Connect a custom domain to your workspace.
          </p>

          <div className="space-y-4">
            <div>
              <Label htmlFor="domain" className="text-sm font-medium mb-2">Domain</Label>
              <div className="flex gap-3">
                <Input id="domain" placeholder="yourdomain.com" className="flex-1" />
                <Button>Verify</Button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">DNS Configuration:</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Add the following records to your DNS provider:
              </p>

              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3">Type</th>
                      <th className="text-left p-3">Name</th>
                      <th className="text-left p-3">Value</th>
                      <th className="text-left p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="p-3 font-mono">A</td>
                      <td className="p-3 font-mono">@</td>
                      <td className="p-3 font-mono">192.168.1.1</td>
                      <td className="p-3">
                        <Badge variant="default">✓ Active</Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">CNAME</td>
                      <td className="p-3 font-mono">www</td>
                      <td className="p-3 font-mono">sefgh.ai</td>
                      <td className="p-3">
                        <Badge variant="default">✓ Active</Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg">
              <div>
                <p className="text-sm font-medium">SSL Certificate</p>
                <p className="text-xs text-muted-foreground">Your domain is secured with SSL.</p>
              </div>
              <Badge variant="default">✓ Active</Badge>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
