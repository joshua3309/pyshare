'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  CreditCard,
  Users,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const chartData = [
  { name: 'Mon', value: 4200 },
  { name: 'Tue', value: 5100 },
  { name: 'Wed', value: 4800 },
  { name: 'Thu', value: 6200 },
  { name: 'Fri', value: 7800 },
  { name: 'Sat', value: 7100 },
  { name: 'Sun', value: 9400 },
];

const recentTxns = [
  { name: 'Stripe payout', amount: '+$12,400.00', type: 'in', time: '2m ago' },
  { name: 'AWS Services', amount: '-$3,200.00', type: 'out', time: '1h ago' },
  { name: 'Client invoice #1042', amount: '+$8,750.00', type: 'in', time: '3h ago' },
];

export function HeroDashboard() {
  return (
    <div className="bg-card">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-destructive/60" />
          <div className="h-3 w-3 rounded-full bg-warning/60" />
          <div className="h-3 w-3 rounded-full bg-success/60" />
        </div>
        <div className="ml-4 flex-1">
          <div className="mx-auto max-w-md rounded-md bg-background/80 px-3 py-1 text-center text-xs text-muted-foreground">
            app.paysphere.com/dashboard
          </div>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
        {/* Sidebar */}
        <div className="hidden lg:flex flex-col gap-1 border-r border-border bg-muted/30 p-4">
          {[
            { icon: TrendingUp, label: 'Overview', active: true },
            { icon: ArrowUpRight, label: 'Send money' },
            { icon: ArrowDownLeft, label: 'Request' },
            { icon: Wallet, label: 'Wallet' },
            { icon: CreditCard, label: 'Cards' },
            { icon: Users, label: 'Recipients' },
          ].map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                item.active
                  ? 'bg-primary/10 font-medium text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="col-span-2 p-6">
          {/* Balance cards */}
          <div className="grid grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="rounded-xl border border-border bg-gradient-to-br from-primary to-chart-4 p-4 text-white"
            >
              <p className="text-xs opacity-80">Total balance</p>
              <p className="mt-1 font-display text-2xl font-bold">$248,590.50</p>
              <p className="mt-1 text-xs opacity-80">+12.5% this month</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="rounded-xl border border-border bg-card p-4"
            >
              <p className="text-xs text-muted-foreground">Money in</p>
              <p className="mt-1 font-display text-2xl font-bold text-success">
                $94,200
              </p>
              <p className="mt-1 text-xs text-muted-foreground">↑ 8.2%</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="rounded-xl border border-border bg-card p-4"
            >
              <p className="text-xs text-muted-foreground">Money out</p>
              <p className="mt-1 font-display text-2xl font-bold text-destructive">
                $31,800
              </p>
              <p className="mt-1 text-xs text-muted-foreground">↓ 3.1%</p>
            </motion.div>
          </div>

          {/* Chart */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-6 rounded-xl border border-border bg-card p-4"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Transaction volume</p>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </div>
              <div className="text-right">
                <p className="font-display text-xl font-bold">$44,600</p>
                <p className="text-xs text-success">+18.2%</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Volume']}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Recent transactions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-4 rounded-xl border border-border bg-card p-4"
          >
            <p className="mb-3 text-sm font-medium">Recent activity</p>
            <div className="space-y-2">
              {recentTxns.map((txn, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3 + i * 0.1 }}
                  className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        txn.type === 'in'
                          ? 'bg-success/10 text-success'
                          : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      {txn.type === 'in' ? (
                        <ArrowDownLeft className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{txn.name}</p>
                      <p className="text-xs text-muted-foreground">{txn.time}</p>
                    </div>
                  </div>
                  <p
                    className={`text-sm font-semibold ${
                      txn.type === 'in' ? 'text-success' : 'text-foreground'
                    }`}
                  >
                    {txn.amount}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
