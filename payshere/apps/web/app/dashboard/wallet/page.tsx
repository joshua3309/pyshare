'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Loader2,
  CheckCircle2,
  Globe,
  Repeat,
} from 'lucide-react';
import { Button } from '@workspace/ui';
import { Input } from '@workspace/ui';
import { Label } from '@workspace/ui';
import { Card } from '@workspace/ui';
import { Badge } from '@workspace/ui';
import { useToast } from '@workspace/ui';
import { cn } from '@workspace/ui';

const wallets = [
  { currency: 'USD', balance: 248590.5, symbol: '$', change: '+12.5%' },
  { currency: 'EUR', balance: 45200.0, symbol: '€', change: '+3.2%' },
  { currency: 'GBP', balance: 18750.0, symbol: '£', change: '-1.1%' },
  { currency: 'JPY', balance: 1250000, symbol: '¥', change: '+0.8%' },
];

const walletTransactions = [
  { type: 'in', label: 'Top up via bank transfer', amount: 5000, time: '2 hours ago' },
  { type: 'out', label: 'Withdrawal to Visa ****4242', amount: 2000, time: '5 hours ago' },
  { type: 'in', label: 'Payment received', amount: 1250, time: '1 day ago' },
  { type: 'out', label: 'Currency conversion EUR→USD', amount: 800, time: '2 days ago' },
  { type: 'in', label: 'Top up via card', amount: 3000, time: '3 days ago' },
];

export default function WalletPage() {
  const { toast } = useToast();
  const [activeWallet, setActiveWallet] = useState('USD');
  const [showTopUp, setShowTopUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setLoading(false);
    setShowTopUp(false);
    setAmount('');
    toast({
      title: 'Top up successful!',
      description: `$${amount} has been added to your wallet.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Wallet</h1>
          <p className="text-sm text-muted-foreground">
            Manage your balances across multiple currencies.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Withdraw
          </Button>
          <Button size="sm" onClick={() => setShowTopUp(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Top up
          </Button>
        </div>
      </div>

      {/* Wallet cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {wallets.map((wallet, i) => (
          <motion.div
            key={wallet.currency}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setActiveWallet(wallet.currency)}
          >
            <Card
              className={cn(
                'cursor-pointer p-5 transition-all hover:-translate-y-0.5',
                activeWallet === wallet.currency
                  ? 'border-primary shadow-premium-lg'
                  : 'hover:shadow-premium'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">{wallet.symbol}</span>
                  <span className="text-sm font-medium">{wallet.currency}</span>
                </div>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-4 font-display text-2xl font-bold">
                {wallet.symbol}
                {wallet.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
              <p
                className={cn(
                  'mt-1 text-xs font-medium',
                  wallet.change.startsWith('+') ? 'text-success' : 'text-destructive'
                )}
              >
                {wallet.change} this month
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Wallet activity */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h3 className="mb-4 font-display text-lg font-semibold">
              {activeWallet} wallet activity
            </h3>
            <div className="space-y-1">
              {walletTransactions.map((txn, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between rounded-lg px-3 py-3 hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full',
                        txn.type === 'in'
                          ? 'bg-success/10 text-success'
                          : 'bg-destructive/10 text-destructive'
                      )}
                    >
                      {txn.type === 'in' ? (
                        <ArrowDownLeft className="h-5 w-5" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{txn.label}</p>
                      <p className="text-xs text-muted-foreground">{txn.time}</p>
                    </div>
                  </div>
                  <p
                    className={cn(
                      'text-sm font-semibold',
                      txn.type === 'in' ? 'text-success' : 'text-foreground'
                    )}
                  >
                    {txn.type === 'in' ? '+' : '-'}${txn.amount.toLocaleString()}
                  </p>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="mb-4 font-display text-lg font-semibold">Quick actions</h3>
            <div className="space-y-2">
              {[
                { icon: Plus, label: 'Top up wallet', desc: 'Add funds via card or bank' },
                { icon: ArrowUpRight, label: 'Withdraw funds', desc: 'Send to bank or card' },
                { icon: Repeat, label: 'Convert currency', desc: 'Exchange between currencies' },
                { icon: CreditCard, label: 'Order virtual card', desc: 'Get a virtual Visa card' },
              ].map((action) => (
                <button
                  key={action.label}
                  className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left transition-all hover:border-primary hover:bg-primary/5"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <action.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-primary to-chart-4 p-6 text-white">
            <Wallet className="h-8 w-8 opacity-80" />
            <h3 className="mt-3 font-display text-lg font-semibold">
              Earn 2% cashback
            </h3>
            <p className="mt-1 text-sm text-white/80">
              Top up your wallet with $5,000+ and earn 2% cashback on all transactions.
            </p>
            <Button variant="secondary" className="mt-4 w-full text-primary">
              Learn more
            </Button>
          </Card>
        </div>
      </div>

      {/* Top up modal */}
      {showTopUp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowTopUp(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <Card className="p-6">
              <h3 className="font-display text-lg font-semibold">Top up wallet</h3>
              <p className="text-sm text-muted-foreground">
                Add funds to your {activeWallet} wallet
              </p>
              <form onSubmit={handleTopUp} className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topup-amount">Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="topup-amount"
                      type="number"
                      placeholder="0.00"
                      className="pl-8 text-lg font-semibold"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['100', '500', '1000'].map((amt) => (
                    <Button
                      key={amt}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setAmount(amt)}
                    >
                      ${amt}
                    </Button>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label>Payment method</Label>
                  <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Visa ****4242</p>
                      <p className="text-xs text-muted-foreground">Expires 12/26</p>
                    </div>
                    <Badge variant="default">Default</Badge>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Top up ${amount || '0.00'}
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}
