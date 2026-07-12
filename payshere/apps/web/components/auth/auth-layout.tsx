'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Zap, Globe } from 'lucide-react';

export function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Left side - form */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="mb-8 inline-flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-chart-4 shadow-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L4 7v10l8 5 8-5V7l-8-5z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="font-display text-xl font-bold">PaySphere</span>
            </Link>

            <h1 className="font-display text-3xl font-bold tracking-tight">
              {title}
            </h1>
            <p className="mt-2 text-muted-foreground">{subtitle}</p>

            <div className="mt-8">{children}</div>
          </motion.div>
        </div>
      </div>

      {/* Right side - visual */}
      <div className="relative hidden flex-1 overflow-hidden bg-gradient-to-br from-primary to-chart-4 lg:block">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-40 bottom-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex h-full flex-col justify-center px-12 text-white">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-md"
          >
            <h2 className="font-display text-4xl font-bold leading-tight">
              The financial platform built for growth
            </h2>
            <p className="mt-4 text-lg text-white/80">
              Join thousands of businesses using PaySphere to accept payments,
              manage wallets, and scale globally.
            </p>

            <div className="mt-12 space-y-6">
              {[
                {
                  icon: ShieldCheck,
                  title: 'Bank-grade security',
                  desc: 'PCI DSS Level 1, 256-bit encryption, and 3D Secure 2.',
                },
                {
                  icon: Zap,
                  title: 'Instant settlements',
                  desc: 'Real-time payment rails with sub-second settlement.',
                },
                {
                  icon: Globe,
                  title: 'Global coverage',
                  desc: 'Accept payments in 40+ countries and 135+ currencies.',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-white/70">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
