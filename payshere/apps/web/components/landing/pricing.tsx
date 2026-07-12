'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@workspace/ui';
import { cn } from '@workspace/ui';

const plans = [
  {
    name: 'Starter',
    description: 'For new businesses getting started with payments.',
    monthly: 0,
    yearly: 0,
    features: [
      'Up to $10K/month volume',
      '2.9% + 30¢ per transaction',
      '100 transactions/month',
      'Basic analytics',
      'Email support',
      'Standard dashboard',
    ],
    cta: 'Start for free',
    highlighted: false,
  },
  {
    name: 'Growth',
    description: 'For scaling businesses that need more power.',
    monthly: 49,
    yearly: 470,
    features: [
      'Up to $500K/month volume',
      '2.5% + 25¢ per transaction',
      'Unlimited transactions',
      'Advanced analytics & exports',
      'Priority support',
      'Custom dashboard',
      'API access & webhooks',
      'Multi-currency wallet',
    ],
    cta: 'Start 14-day trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    description: 'For high-volume businesses with custom needs.',
    monthly: null,
    yearly: null,
    features: [
      'Unlimited volume',
      'Custom pricing',
      'Dedicated account manager',
      '24/7 phone support',
      'SLA & compliance review',
      'Custom integrations',
      'On-premise deployment option',
      'White-glove onboarding',
    ],
    cta: 'Contact sales',
    highlighted: false,
  },
];

export function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="relative bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Pricing
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-balance">
            Start free, scale as you grow. No hidden fees, no surprises.
          </p>

          {/* Billing toggle */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-border bg-card p-1">
            <button
              onClick={() => setYearly(false)}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm font-medium transition-all',
                !yearly ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm font-medium transition-all',
                yearly ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
              )}
            >
              Yearly
              <span className="ml-1.5 text-xs text-success">Save 20%</span>
            </button>
          </div>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={cn(
                'relative rounded-2xl border bg-card p-8 shadow-premium',
                plan.highlighted
                  ? 'border-primary shadow-premium-lg lg:scale-105'
                  : 'border-border'
              )}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground">
                  Most popular
                </div>
              )}
              <h3 className="font-display text-xl font-bold">{plan.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {plan.description}
              </p>
              <div className="mt-6">
                {plan.monthly !== null ? (
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-5xl font-bold">
                      ${yearly ? Math.round(plan.yearly! / 12) : plan.monthly}
                    </span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                ) : (
                  <div className="font-display text-5xl font-bold">Custom</div>
                )}
                {plan.monthly !== null && yearly && plan.yearly! > 0 && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Billed ${plan.yearly}/year
                  </p>
                )}
              </div>
              <Button
                className="mt-6 w-full"
                variant={plan.highlighted ? 'default' : 'outline'}
              >
                {plan.cta}
              </Button>
              <div className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-success/10">
                      <Check className="h-3 w-3 text-success" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
