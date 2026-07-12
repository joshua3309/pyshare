'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import { Button } from '@workspace/ui';
import { HeroDashboard } from './hero-dashboard';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-mesh pt-32 pb-20">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />

      {/* Glow orbs */}
      <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px] animate-pulse-glow" />
      <div className="absolute top-20 right-10 h-[300px] w-[300px] rounded-full bg-chart-4/10 blur-[100px] animate-pulse-glow" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur"
          >
            <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
            Now with real-time payment rails in 40+ countries
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="font-display text-5xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            Financial infrastructure
            <br />
            <span className="gradient-text">for the internet economy</span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-balance sm:text-xl"
          >
            PaySphere unifies payments, wallets, invoicing, and analytics into a
            single, developer-friendly platform. Scale from first dollar to
            billion-dollar volume.
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/register">
              <Button size="lg" className="group h-12 px-8 text-base">
                Start building free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base"
              >
                View live demo
              </Button>
            </Link>
          </motion.div>

          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-success" />
              PCI DSS Level 1
            </span>
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-warning" />
              99.99% uptime
            </span>
            <span className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              40+ countries
            </span>
          </motion.div>
        </div>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-16 max-w-5xl"
        >
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/20 via-chart-4/10 to-chart-2/10 blur-2xl" />
          <div className="relative rounded-2xl border border-border bg-card shadow-premium-lg overflow-hidden">
            <HeroDashboard />
          </div>
        </motion.div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-20 text-center"
        >
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Trusted by thousands of businesses worldwide
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60">
            {['Acme Corp', 'Globex', 'Initech', 'Umbrella', 'Hooli', 'Soylent'].map(
              (name) => (
                <span
                  key={name}
                  className="font-display text-xl font-bold text-muted-foreground"
                >
                  {name}
                </span>
              )
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
