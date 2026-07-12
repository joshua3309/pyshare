'use client';

import { motion } from 'framer-motion';
import {
  CreditCard,
  Wallet,
  FileText,
  BarChart3,
  Shield,
  Globe,
  Zap,
  Bell,
} from 'lucide-react';

const features = [
  {
    icon: CreditCard,
    title: 'Payments',
    description:
      'Accept and send payments globally with cards, bank transfers, and local payment methods. Stripe-ready integration.',
    color: 'text-primary bg-primary/10',
  },
  {
    icon: Wallet,
    title: 'Digital Wallet',
    description:
      'Store funds, top up, and withdraw with a multi-currency wallet. Real-time balance tracking and instant transfers.',
    color: 'text-chart-4 bg-chart-4/10',
  },
  {
    icon: FileText,
    title: 'Invoicing & Billing',
    description:
      'Create professional invoices, set up recurring billing, and automatically send receipts. Get paid on time, every time.',
    color: 'text-chart-2 bg-chart-2/10',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reporting',
    description:
      'Real-time dashboards, transaction insights, and exportable reports. Make data-driven decisions with confidence.',
    color: 'text-chart-3 bg-chart-3/10',
  },
  {
    icon: Shield,
    title: 'Security & Compliance',
    description:
      'PCI DSS Level 1, 3D Secure 2, and end-to-end encryption. KYC/AML built-in. Your data is always protected.',
    color: 'text-success bg-success/10',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description:
      'Process payments in 40+ countries with 135+ currencies. Automatic currency conversion and settlement.',
    color: 'text-primary bg-primary/10',
  },
  {
    icon: Zap,
    title: 'Instant Transfers',
    description:
      'Real-time payment rails with sub-second settlement. No waiting, no delays. Your money moves at the speed of business.',
    color: 'text-warning bg-warning/10',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description:
      'In-app, email, and webhook notifications for every event. Stay informed about your money, wherever you are.',
    color: 'text-chart-5 bg-chart-5/10',
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Everything you need
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            One platform for all your financial needs
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-balance">
            From accepting your first payment to managing billions in volume,
            PaySphere gives you the tools to build, scale, and optimize your
            financial operations.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="group rounded-2xl border border-border bg-card p-6 shadow-premium transition-all hover:shadow-premium-lg"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.color} transition-transform group-hover:scale-110`}
              >
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
