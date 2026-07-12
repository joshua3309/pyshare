'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@workspace/ui';

export function CTA() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary to-chart-4 px-8 py-16 text-center text-white sm:px-16"
        >
          {/* Decorative elements */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute inset-0 bg-grid opacity-10" />

          <div className="relative">
            <h2 className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              Ready to build your financial future?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80 text-balance">
              Join thousands of businesses that trust PaySphere to power their
              payments, wallets, and financial operations. Start free, no credit
              card required.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button
                  size="lg"
                  variant="secondary"
                  className="group h-12 px-8 text-base text-primary"
                >
                  Get started free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 border-white/30 bg-transparent px-8 text-base text-white hover:bg-white/10 hover:text-white"
                >
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
