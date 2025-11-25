'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function DomainTab() {
  const [domain, setDomain] = useState('');
  const [verified, setVerified] = useState(false);

  const handleVerify = () => {
    // Simulate verification
    if (domain) {
      setVerified(true);
      toast.success('Domain verified successfully');
    } else {
      toast.error('Please enter a domain');
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Custom Domain</h3>
        <p className="text-sm text-muted-foreground">
          Connect a custom domain to your workspace.
        </p>
      </div>

      {/* Domain Input */}
      <div>
        <Label htmlFor="domain" className="text-sm font-medium mb-2">
          Domain
        </Label>
        <div className="flex gap-3">
          <Input
            id="domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="yourdomain.com"
            className="flex-1"
          />
          <Button onClick={handleVerify}>Verify</Button>
        </div>
      </div>

      {/* DNS Configuration */}
      {domain && (
        <div>
          <h4 className="text-base font-semibold mb-3">DNS Configuration</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Add the following records to your DNS provider:
          </p>

          <div className="border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Type</th>
                  <th className="text-left p-4 font-medium">Name</th>
                  <th className="text-left p-4 font-medium">Value</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-4 font-mono">A</td>
                  <td className="p-4 font-mono">@</td>
                  <td className="p-4 font-mono">192.168.1.1</td>
                  <td className="p-4">
                    {verified ? (
                      <Badge variant="default">✓ Active</Badge>
                    ) : (
                      <Badge variant="secondary">Pending</Badge>
                    )}
                  </td>
                  <td className="p-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy('192.168.1.1')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-mono">CNAME</td>
                  <td className="p-4 font-mono">www</td>
                  <td className="p-4 font-mono">sefgh.ai</td>
                  <td className="p-4">
                    {verified ? (
                      <Badge variant="default">✓ Active</Badge>
                    ) : (
                      <Badge variant="secondary">Pending</Badge>
                    )}
                  </td>
                  <td className="p-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy('sefgh.ai')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SSL Certificate */}
      {verified && (
        <div className="flex items-center justify-between p-5 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-xl">
          <div>
            <p className="text-sm font-medium">SSL Certificate</p>
            <p className="text-xs text-muted-foreground">Your domain is secured with SSL.</p>
          </div>
          <Badge variant="default">✓ Active</Badge>
        </div>
      )}

      {/* Documentation Link */}
      <div className="p-4 bg-muted/50 border border-border rounded-lg">
        <p className="text-sm mb-2">Need help setting up your domain?</p>
        <a
          href="#"
          className="text-sm text-primary hover:underline inline-flex items-center gap-1"
        >
          View documentation
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
