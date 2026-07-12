'use client';

import { motion } from 'framer-motion';
import { UserPlus, Link2, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Create your account',
    description:
      'Sign up in minutes. Complete KYC verification and link your bank account or card to get started.',
    badge: 'Step 1',
  },
  {
    icon: Link2,
    title: 'Connect & integrate',
    description:
      'Use our REST APIs, SDKs, and webhooks to integrate payments into your app. Or use our no-code dashboard.',
    badge: 'Step 2',
  },
  {
    icon: TrendingUp,
    title: 'Scale your business',
    description:
      'Accept payments, manage subscriptions, send payouts, and track analytics — all from one dashboard.',
    badge: 'Step 3',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            How it works
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Get started in three simple steps
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-balance">
            From signup to your first payment in under 10 minutes. No
            complexity, no friction.
          </p>
        </motion.div>

        <div className="relative mt-16">
          {/* Connecting line */}
          <div className="absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-card shadow-premium">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <span className="absolute -right-1 -top-1 rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold">
                  {step.title}
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
