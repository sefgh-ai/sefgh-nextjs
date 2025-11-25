'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const users = [
  { id: 1, name: 'You', role: 'owner', permissions: 'Full Access', isOwner: true },
  { id: 2, name: 'John Doe', role: 'admin', permissions: 'Edit, View', isOwner: false },
  { id: 3, name: 'Jane Smith', role: 'viewer', permissions: 'View Only', isOwner: false }
];

export default function UserPermissionTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">User Permissions</h3>
        <p className="text-sm text-muted-foreground">
          Manage who can access and edit this workspace.
        </p>
      </div>

      {/* Users Table */}
      <div className="border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium">User</th>
              <th className="text-left p-4 text-sm font-medium">Role</th>
              <th className="text-left p-4 text-sm font-medium">Permissions</th>
              <th className="text-left p-4 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user.id} className={idx !== users.length - 1 ? 'border-b border-border' : ''}>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                </td>
                <td className="p-4">
                  <Badge variant={user.isOwner ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                </td>
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">{user.permissions}</span>
                </td>
                <td className="p-4">
                  {!user.isOwner && (
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite User */}
      <div className="flex gap-3">
        <Input placeholder="Enter email address" className="flex-1" />
        <Button>+ Invite User</Button>
      </div>
    </div>
  );
}
