'use client';

import React, { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function DataControlsTab() {
  const [dataUsageEnabled, setDataUsageEnabled] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [exportPending, setExportPending] = useState(false);

  const handleExportRequest = () => {
    setExportPending(true);
    toast.success('Export requested. Check your email within 7 days.');
    // API call to request export
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmation === 'DELETE') {
      toast.success('Account deletion initiated');
      setShowDeleteDialog(false);
      // API call to delete account
      // window.location.href = '/account-deleted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Data */}
      <div className="py-6 border-b border-border">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 max-w-xl">
            <h3 className="text-base font-semibold mb-2">Export Data</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Download a copy of your account data including conversations, settings, and usage
              history.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleExportRequest}
            disabled={exportPending}
          >
            {exportPending ? 'Export Pending' : 'Request Export'}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground italic">
          Processing time: Up to 7 days. You'll receive an email when your data is ready to
          download.
        </p>
      </div>

      {/* Data Usage */}
      <div className="flex items-start justify-between gap-4 py-6 border-b border-border">
        <div className="flex-1 max-w-xl">
          <h3 className="text-base font-semibold mb-2">Data Usage</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-2">
            Allow your data to be used for training AI models. This helps improve the quality of
            responses.
          </p>
          <a href="#" className="text-sm text-primary hover:underline font-medium">
            Privacy Policy
          </a>
        </div>
        <Switch
          checked={dataUsageEnabled}
          onCheckedChange={setDataUsageEnabled}
          aria-label="Enable data usage"
        />
      </div>

      {/* Delete Account */}
      <div className="py-6">
        <div className="p-6 border-2 border-destructive/50 bg-destructive/5 rounded-xl">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-destructive mb-2">Delete Account</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Permanently delete your account and all associated data. This action{' '}
                <span className="font-bold">cannot be undone</span>.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              Delete Your Account?
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                <p>This will permanently delete:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>All your conversations</li>
                  <li>Your account settings</li>
                  <li>Your search history</li>
                  <li>All associated data</li>
                </ul>
                <p className="font-semibold">This action cannot be undone.</p>
                <div className="pt-4">
                  <label htmlFor="deleteConfirm" className="text-sm font-medium">
                    Type "DELETE" to confirm:
                  </label>
                  <Input
                    id="deleteConfirm"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder="DELETE"
                    className="mt-2"
                  />
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmation('')}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deleteConfirmation !== 'DELETE'}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
