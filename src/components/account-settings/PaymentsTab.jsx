'use client';

import React from 'react';
import { CreditCard, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const paymentMethods = [
  { id: 1, type: 'Visa', last4: '4242', expiry: '12/25', isDefault: true },
  { id: 2, type: 'Mastercard', last4: '5555', expiry: '08/26', isDefault: false }
];

export default function PaymentsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Payment Methods</h3>
        <p className="text-sm text-muted-foreground">
          Manage your payment methods for subscriptions and purchases.
        </p>
      </div>

      {/* Payment Methods List */}
      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <div key={method.id} className="p-5 border border-border rounded-xl bg-card flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium">{method.type} •••• {method.last4}</p>
                  {method.isDefault && <Badge variant="default" className="text-xs">Default</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">Expires {method.expiry}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {!method.isDefault && (
                <Button variant="outline" size="sm">Set as Default</Button>
              )}
              <Button variant="ghost" size="sm">Edit</Button>
              <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Payment Method */}
      <Button variant="outline">
        <Plus className="w-4 h-4 mr-2" />
        Add Payment Method
      </Button>
    </div>
  );
}
