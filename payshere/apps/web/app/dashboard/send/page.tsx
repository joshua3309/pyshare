'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  User,
  Mail,
  DollarSign,
  Loader2,
  CheckCircle2,
  Globe,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@workspace/ui';
import { Input } from '@workspace/ui';
import { Label } from '@workspace/ui';
import { Card } from '@workspace/ui';
import { Textarea } from '@workspace/ui';
import { useToast } from '@workspace/ui';
import { cn } from '@workspace/ui';

const recentRecipients = [
  { name: 'John Smith', email: 'john@acme.com', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { name: 'Emily Davis', email: 'emily@globex.com', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { name: 'Marcus Lee', email: 'marcus@initech.com', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150' },
];

export default function SendMoneyPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    recipient: '',
    email: '',
    amount: '',
    currency: 'USD',
    note: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    setSuccess(true);
    toast({
      title: 'Payment sent!',
      description: `$${formData.amount} sent to ${formData.recipient}`,
    });
  };

  const fee = formData.amount ? (parseFloat(formData.amount) * 0.029 + 0.3).toFixed(2) : '0.00';
  const total = formData.amount ? (parseFloat(formData.amount) + parseFloat(fee)).toFixed(2) : '0.00';

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Send money</h1>
        <p className="text-sm text-muted-foreground">
          Transfer funds to anyone, anywhere in the world.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
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
                Payment sent successfully!
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                ${formData.amount} has been sent to {formData.recipient}
              </p>
              <div className="mx-auto mt-6 max-w-xs space-y-2 rounded-lg bg-muted/50 p-4 text-left text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Recipient</span>
                  <span className="font-medium">{formData.recipient}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">${formData.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fee</span>
                  <span className="font-medium">${fee}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold">${total}</span>
                </div>
              </div>
              <Button
                className="mt-6"
                onClick={() => {
                  setSuccess(false);
                  setFormData({ recipient: '', email: '', amount: '', currency: 'USD', note: '' });
                }}
              >
                Send another payment
              </Button>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Recent recipients */}
                <div>
                  <Label className="mb-3 block">Recent recipients</Label>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {recentRecipients.map((r) => (
                      <button
                        key={r.email}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, recipient: r.name, email: r.email })
                        }
                        className="flex flex-col items-center gap-1 rounded-xl border border-border p-3 transition-all hover:border-primary hover:bg-primary/5"
                      >
                        <img src={r.avatar} alt={r.name} className="h-10 w-10 rounded-full object-cover" />
                        <span className="text-xs font-medium">{r.name.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="recipient"
                        placeholder="John Smith"
                        className="pl-10"
                        value={formData.recipient}
                        onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Recipient email</Label>
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

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-2 sm:col-span-2">
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
                    <Label htmlFor="currency">Currency</Label>
                    <select
                      id="currency"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="JPY">JPY</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Note (optional)</Label>
                  <Textarea
                    id="note"
                    placeholder="Add a note..."
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  />
                </div>

                {/* Fee breakdown */}
                {formData.amount && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2 rounded-lg bg-muted/50 p-4 text-sm"
                  >
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transfer amount</span>
                      <span className="font-medium">${formData.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Processing fee (2.9% + $0.30)</span>
                      <span className="font-medium">${fee}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold">${total}</span>
                    </div>
                  </motion.div>
                )}

                {/* Trust indicators */}
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-success" />
                    Bank-grade encryption
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-warning" />
                    Instant transfer
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-primary" />
                    135+ currencies
                  </span>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending payment...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send ${formData.amount || '0.00'}
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
