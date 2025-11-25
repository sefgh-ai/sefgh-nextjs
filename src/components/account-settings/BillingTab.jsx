'use client';

import React from 'react';
import { CreditCard, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const billingHistory = [
  { id: 1, date: 'Nov 1, 2025', amount: '$29.99', status: 'Paid', invoice: 'INV-001' },
  { id: 2, date: 'Oct 1, 2025', amount: '$29.99', status: 'Paid', invoice: 'INV-002' },
  { id: 3, date: 'Sep 1, 2025', amount: '$29.99', status: 'Paid', invoice: 'INV-003' }
];

export default function BillingTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Billing</h3>
        <p className="text-sm text-muted-foreground">
          Manage your billing information and payment history.
        </p>
      </div>

      {/* Current Plan */}
      <div className="p-6 border border-border rounded-xl bg-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-semibold">Current Plan</h4>
            <p className="text-2xl font-bold mt-2">Pro Plan</p>
            <p className="text-sm text-muted-foreground">$29.99/month</p>
          </div>
          <Badge variant="default">Active</Badge>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Upgrade</Button>
          <Button variant="ghost">Cancel Subscription</Button>
        </div>
      </div>

      {/* Billing History */}
      <div>
        <h4 className="text-base font-semibold mb-4">Billing History</h4>
        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 text-sm font-medium">Date</th>
                <th className="text-left p-4 text-sm font-medium">Amount</th>
                <th className="text-left p-4 text-sm font-medium">Status</th>
                <th className="text-left p-4 text-sm font-medium">Invoice</th>
                <th className="text-left p-4 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {billingHistory.map((item, idx) => (
                <tr key={item.id} className={idx !== billingHistory.length - 1 ? 'border-b border-border' : ''}>
                  <td className="p-4 text-sm">{item.date}</td>
                  <td className="p-4 text-sm font-medium">{item.amount}</td>
                  <td className="p-4">
                    <Badge variant="secondary">{item.status}</Badge>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{item.invoice}</td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
