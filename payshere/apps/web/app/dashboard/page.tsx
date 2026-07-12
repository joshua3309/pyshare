'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  CreditCard,
  Plus,
  Send,
  Download,
  MoreHorizontal,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Button } from '@workspace/ui';
import { Card } from '@workspace/ui';
import { Badge } from '@workspace/ui';
import { cn } from '@workspace/ui';

const volumeData = [
  { name: 'Jan', inflow: 32000, outflow: 18000 },
  { name: 'Feb', inflow: 41000, outflow: 22000 },
  { name: 'Mar', inflow: 38000, outflow: 19000 },
  { name: 'Apr', inflow: 52000, outflow: 28000 },
  { name: 'May', inflow: 61000, outflow: 31000 },
  { name: 'Jun', inflow: 78000, outflow: 35000 },
  { name: 'Jul', inflow: 94000, outflow: 42000 },
];

const categoryData = [
  { name: 'Payments', value: 45, color: 'hsl(var(--primary))' },
  { name: 'Subscriptions', value: 25, color: 'hsl(var(--chart-4))' },
  { name: 'Invoices', value: 20, color: 'hsl(var(--chart-2))' },
  { name: 'Other', value: 10, color: 'hsl(var(--chart-3))' },
];

const recentTransactions = [
  {
    id: 'TXN-001',
    name: 'Stripe payout',
    type: 'inflow',
    amount: 12400,
    date: '2024-01-15',
    status: 'completed',
  },
  {
    id: 'TXN-002',
    name: 'AWS Services',
    type: 'outflow',
    amount: 3200,
    date: '2024-01-14',
    status: 'completed',
  },
  {
    id: 'TXN-003',
    name: 'Client invoice #1042',
    type: 'inflow',
    amount: 8750,
    date: '2024-01-13',
    status: 'completed',
  },
  {
    id: 'TXN-004',
    name: 'Office rent',
    type: 'outflow',
    amount: 4500,
    date: '2024-01-12',
    status: 'pending',
  },
  {
    id: 'TXN-005',
    name: 'Figma subscription',
    type: 'outflow',
    amount: 45,
    date: '2024-01-11',
    status: 'completed',
  },
];

const stats = [
  {
    label: 'Total balance',
    value: '$248,590.50',
    change: '+12.5%',
    trend: 'up',
    icon: Wallet,
    color: 'from-primary to-chart-4',
  },
  {
    label: 'Money in (30d)',
    value: '$94,200.00',
    change: '+8.2%',
    trend: 'up',
    icon: ArrowDownLeft,
    color: 'from-success to-chart-2',
  },
  {
    label: 'Money out (30d)',
    value: '$31,800.00',
    change: '-3.1%',
    trend: 'down',
    icon: ArrowUpRight,
    color: 'from-warning to-destructive',
  },
  {
    label: 'Pending',
    value: '$12,450.00',
    change: '+5.4%',
    trend: 'up',
    icon: CreditCard,
    color: 'from-chart-4 to-chart-5',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.05 },
  }),
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Welcome back, Sarah
          </h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening with your account today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Link href="/dashboard/send">
            <Button size="sm">
              <Send className="mr-2 h-4 w-4" />
              Send money
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <Card className="relative overflow-hidden p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 font-display text-2xl font-bold">
                    {stat.value}
                  </p>
                  <div className="mt-2 flex items-center gap-1">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="h-3.5 w-3.5 text-success" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                    )}
                    <span
                      className={cn(
                        'text-xs font-medium',
                        stat.trend === 'up' ? 'text-success' : 'text-destructive'
                      )}
                    >
                      {stat.change}
                    </span>
                    <span className="text-xs text-muted-foreground">vs last month</span>
                  </div>
                </div>
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white',
                    stat.color
                  )}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Volume chart */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold">
                  Transaction volume
                </h3>
                <p className="text-sm text-muted-foreground">
                  Inflow vs outflow over the last 7 months
                </p>
              </div>
              <div className="flex gap-4 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                  Inflow
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-chart-3" />
                  Outflow
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="inflow" x1="0" y1="0" x2="0" y2="1">
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
                  <linearGradient id="outflow" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--chart-3))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--chart-3))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
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
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                />
                <Area
                  type="monotone"
                  dataKey="inflow"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#inflow)"
                />
                <Area
                  type="monotone"
                  dataKey="outflow"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  fill="url(#outflow)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Category breakdown */}
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <Card className="p-6">
            <h3 className="font-display text-lg font-semibold">
              Revenue by source
            </h3>
            <p className="text-sm text-muted-foreground">This month</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => `${value}%`}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {categoryData.map((cat) => (
                <div
                  key={cat.name}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: cat.color }}
                    />
                    {cat.name}
                  </span>
                  <span className="font-medium">{cat.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Quick actions */}
      <motion.div
        custom={6}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-4 sm:grid-cols-4"
      >
        {[
          { icon: Send, label: 'Send money', href: '/dashboard/send', color: 'text-primary' },
          { icon: ArrowDownLeft, label: 'Request', href: '/dashboard/request', color: 'text-success' },
          { icon: Plus, label: 'Add funds', href: '/dashboard/wallet', color: 'text-chart-4' },
          { icon: CreditCard, label: 'New invoice', href: '/dashboard/invoices', color: 'text-chart-3' },
        ].map((action) => (
          <Link key={action.label} href={action.href}>
            <Card className="flex flex-col items-center gap-2 p-5 transition-all hover:shadow-premium-lg hover:-translate-y-0.5">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl bg-muted',
                  action.color
                )}
              >
                <action.icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium">{action.label}</span>
            </Card>
          </Link>
        ))}
      </motion.div>

      {/* Recent transactions */}
      <motion.div
        custom={7}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">
              Recent transactions
            </h3>
            <Link href="/dashboard/transactions">
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </Link>
          </div>
          <div className="space-y-1">
            {recentTransactions.map((txn, i) => (
              <motion.div
                key={txn.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="flex items-center justify-between rounded-lg px-3 py-3 hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full',
                      txn.type === 'inflow'
                        ? 'bg-success/10 text-success'
                        : 'bg-destructive/10 text-destructive'
                    )}
                  >
                    {txn.type === 'inflow' ? (
                      <ArrowDownLeft className="h-5 w-5" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{txn.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {txn.date} · {txn.id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={txn.status === 'completed' ? 'default' : 'secondary'}
                    className={cn(
                      txn.status === 'completed'
                        ? 'bg-success/10 text-success'
                        : 'bg-warning/10 text-warning'
                    )}
                  >
                    {txn.status}
                  </Badge>
                  <p
                    className={cn(
                      'text-sm font-semibold',
                      txn.type === 'inflow' ? 'text-success' : 'text-foreground'
                    )}
                  >
                    {txn.type === 'inflow' ? '+' : '-'}${txn.amount.toLocaleString()}
                  </p>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
