'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    quote:
      'PaySphere transformed how we handle payments. We went from 3 different tools to one platform and cut our payment costs by 40%.',
    name: 'Sarah Chen',
    role: 'CEO, FlowCommerce',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    quote:
      'The developer experience is unmatched. We integrated payments in an afternoon. The API is clean, the docs are excellent, and webhooks just work.',
    name: 'Marcus Rodriguez',
    role: 'CTO, DevHub',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    quote:
      'We process over $2M/month through PaySphere. The analytics dashboard gives us insights we never had before. It is genuinely a competitive advantage.',
    name: 'Emily Watson',
    role: 'Head of Finance, ScaleUp',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    quote:
      'The invoicing feature alone saved my team 10 hours a week. Recurring billing, automatic receipts, and the professional templates are worth every penny.',
    name: 'David Kim',
    role: 'Founder, StudioKit',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    quote:
      'We needed a payment platform that could scale with us. PaySphere handles our Black Friday traffic without breaking a sweat. 99.99% uptime is real.',
    name: 'Aisha Patel',
    role: 'VP Engineering, Retail.io',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    quote:
      'Global payments were a nightmare before PaySphere. Now we accept local payment methods in 40+ countries with automatic currency conversion. Game changer.',
    name: 'Thomas Mueller',
    role: 'COO, WorldGoods',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-warning text-warning" />
            ))}
          </div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Loved by builders
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Thousands of businesses trust PaySphere
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-balance">
            From startups to enterprises, companies of all sizes rely on
            PaySphere to power their financial operations.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-premium"
            >
              <Quote className="h-8 w-8 text-primary/20" />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                {t.quote}
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
