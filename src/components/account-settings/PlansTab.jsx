'use client';

import React from 'react';
import { Check, Zap, Crown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    icon: Sparkles,
    current: true,
    features: [
      'Basic AI responses',
      '50 searches per day',
      'Standard response time',
      'Community support'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$29.99',
    period: '/month',
    icon: Zap,
    popular: true,
    current: false,
    features: [
      'Advanced AI responses',
      'Unlimited searches',
      'Priority response time',
      'Email support',
      'Code analysis',
      'Custom instructions'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$99.99',
    period: '/month',
    icon: Crown,
    current: false,
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Admin dashboard',
      'Priority support',
      'Custom integrations',
      'SLA guarantee',
      'Dedicated account manager'
    ]
  }
];

export default function PlansTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Plans</h3>
        <p className="text-sm text-muted-foreground">
          Choose the plan that's right for you.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.id}
              className={`relative p-6 border-2 rounded-xl transition-all ${
                plan.current
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute top-4 right-4" variant="default">
                  Popular
                </Badge>
              )}
              {plan.current && (
                <Badge className="absolute top-4 right-4" variant="secondary">
                  Current Plan
                </Badge>
              )}

              <div className="mb-6">
                <Icon className="w-10 h-10 mb-4 text-primary" />
                <h4 className="text-xl font-bold mb-2">{plan.name}</h4>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={plan.current ? 'secondary' : 'default'}
                disabled={plan.current}
              >
                {plan.current ? 'Current Plan' : 'Upgrade'}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
