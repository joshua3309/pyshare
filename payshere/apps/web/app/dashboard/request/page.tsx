'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowDownLeft,
  User,
  Mail,
  DollarSign,
  Loader2,
  CheckCircle2,
  Copy,
  Link2,
  Share2,
} from 'lucide-react';
import { Button } from '@workspace/ui';
import { Input } from '@workspace/ui';
import { Label } from '@workspace/ui';
import { Card } from '@workspace/ui';
import { Textarea } from '@workspace/ui';
import { useToast } from '@workspace/ui';

export default function RequestMoneyPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    from: '',
    email: '',
    amount: '',
    note: '',
  });
  const [paymentLink, setPaymentLink] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setLoading(false);
    setSuccess(true);
    setPaymentLink(`https://pay.paysphere.com/req/${Math.random().toString(36).substring(2, 12)}`);
    toast({
      title: 'Request created!',
      description: `Payment request for $${formData.amount} sent to ${formData.from}`,
    });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(paymentLink);
    toast({ title: 'Link copied!', description: 'Payment link copied to clipboard.' });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Request money</h1>
        <p className="text-sm text-muted-foreground">
          Send a payment request or generate a payment link.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10"
              >
                <CheckCircle2 className="h-8 w-8 text-success" />
              </motion.div>
              <h2 className="mt-4 font-display text-xl font-semibold">
                Payment request sent!
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                We&apos;ve sent a payment request to {formData.from} for ${formData.amount}
              </p>

              <div className="mt-6 space-y-3">
                <Label>Payment link</Label>
                <div className="flex gap-2">
                  <Input value={paymentLink} readOnly className="flex-1" />
                  <Button variant="outline" onClick={copyLink}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button variant="outline" className="flex-1">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    setSuccess(false);
                    setFormData({ from: '', email: '', amount: '', note: '' });
                  }}
                >
                  New request
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="from">Request from</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="from"
                        placeholder="John Smith"
                        className="pl-10"
                        value={formData.from}
                        onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      className="pl-10 text-lg font-semibold"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Message (optional)</Label>
                  <Textarea
                    id="note"
                    placeholder="What is this request for?"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating request...
                    </>
                  ) : (
                    <>
                      <ArrowDownLeft className="mr-2 h-4 w-4" />
                      Request ${formData.amount || '0.00'}
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <Button type="button" variant="outline" className="w-full">
                  <Link2 className="mr-2 h-4 w-4" />
                  Generate payment link
                </Button>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
