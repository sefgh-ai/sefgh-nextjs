'use client';

import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export default function SecurityTab() {
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [showLogoutAllDialog, setShowLogoutAllDialog] = useState(false);

  const handleMfaToggle = (checked) => {
    if (checked) {
      // Show MFA setup modal
      toast.info('MFA setup modal would open here');
    } else {
      // Show disable confirmation
      if (window.confirm('Are you sure you want to disable multi-factor authentication?')) {
        setMfaEnabled(false);
        toast.success('Multi-factor authentication disabled');
      }
    }
  };

  const handleLogout = () => {
    // Clear session and redirect
    toast.success('Logged out successfully');
    // window.location.href = '/login';
  };

  const handleLogoutAll = () => {
    setShowLogoutAllDialog(false);
    // Clear all sessions
    toast.success('Logged out of all devices');
    // window.location.href = '/login';
  };

  return (
    <div className="space-y-6">
      {/* Multi-factor Authentication */}
      <div className="flex items-start justify-between gap-4 py-6 border-b border-border">
        <div className="flex-1 max-w-xl">
          <h3 className="text-base font-semibold mb-2">Multi-factor authentication</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Require an extra security challenge when logging in. If you are unable to pass this
            challenge, you will have the option to recover your account via email.
          </p>
        </div>
        <Switch
          checked={mfaEnabled}
          onCheckedChange={handleMfaToggle}
          aria-label="Enable MFA"
        />
      </div>

      {/* Log out of this device */}
      <div className="flex items-center justify-between py-5 border-b border-border">
        <h3 className="text-base font-medium">Log out of this device</h3>
        <Button variant="outline" onClick={handleLogout}>
          Log out
          <LogOut className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Log out of all devices */}
      <div className="py-5 border-b border-border">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-base font-medium">Log out of all devices</h3>
          <Button
            variant="destructive"
            onClick={() => setShowLogoutAllDialog(true)}
          >
            Log out all
            <LogOut className="w-4 h-4 ml-2" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
          Log out of all active sessions across all devices, including your current session. It may
          take up to <span className="font-medium">30 minutes</span> for other devices to be logged out.
        </p>
      </div>

      {/* Secure sign in section */}
      <div className="py-5">
        <h3 className="text-base font-semibold mb-2">Secure sign in with ChatGPT</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-2 max-w-xl">
          Sign in to websites and apps across the internet with the trusted security of ChatGPT.
        </p>
        <a href="#" className="text-sm text-primary hover:underline font-medium">
          Learn more
        </a>

        {/* Empty State */}
        <div className="mt-6 p-8 bg-muted/50 border border-dashed border-border rounded-xl text-center">
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            You haven't used ChatGPT to sign into any websites or apps yet. Once you do, they'll show
            up here.
          </p>
        </div>
      </div>

      {/* Logout All Dialog */}
      <AlertDialog open={showLogoutAllDialog} onOpenChange={setShowLogoutAllDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out of all devices?</AlertDialogTitle>
            <AlertDialogDescription>
              This will end all active sessions. You'll need to sign in again on all devices.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogoutAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Log out all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
