'use client';

import { motion } from 'framer-motion';
import {
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Globe,
  Server,
  Zap,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
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
import { Card } from '@workspace/ui';
import { Badge } from '@workspace/ui';
import { cn } from '@workspace/ui';

const userGrowthData = [
  { name: 'Jan', users: 1200, revenue: 45000 },
  { name: 'Feb', users: 1850, revenue: 62000 },
  { name: 'Mar', users: 2400, revenue: 78000 },
  { name: 'Apr', users: 3200, revenue: 95000 },
  { name: 'May', users: 4100, revenue: 128000 },
  { name: 'Jun', users: 5800, revenue: 165000 },
  { name: 'Jul', users: 7200, revenue: 210000 },
];

const serviceHealth = [
  { name: 'auth-service', status: 'healthy', uptime: '99.99%', latency: '42ms' },
  { name: 'user-service', status: 'healthy', uptime: '99.98%', latency: '38ms' },
  { name: 'payment-service', status: 'healthy', uptime: '99.97%', latency: '65ms' },
  { name: 'transaction-service', status: 'healthy', uptime: '99.99%', latency: '51ms' },
  { name: 'wallet-service', status: 'healthy', uptime: '99.96%', latency: '44ms' },
  { name: 'notification-service', status: 'degraded', uptime: '99.12%', latency: '180ms' },
  { name: 'billing-service', status: 'healthy', uptime: '99.99%', latency: '39ms' },
];

const transactionDistribution = [
  { name: 'Payments', value: 45, color: 'hsl(var(--primary))' },
  { name: 'Transfers', value: 25, color: 'hsl(var(--chart-4))' },
  { name: 'Deposits', value: 15, color: 'hsl(var(--chart-2))' },
  { name: 'Withdrawals', value: 10, color: 'hsl(var(--chart-3))' },
  { name: 'Refunds', value: 5, color: 'hsl(var(--chart-5))' },
];

const recentActivity = [
  { type: 'user', action: 'New user registered', detail: 'john@acme.com', time: '2m ago' },
  { type: 'payment', action: 'Large payment flagged', detail: '$45,000 — Acme Corp', time: '15m ago' },
  { type: 'kyc', action: 'KYC submitted for review', detail: 'User: marcus@initech.com', time: '32m ago' },
  { type: 'alert', action: 'Failed payment spike', detail: '12 failures in 5 min', time: '1h ago' },
  { type: 'user', action: 'User suspended', detail: 'suspicious@temp.com', time: '2h ago' },
  { type: 'system', action: 'Auto-scaling triggered', detail: 'payment-service: 3→5 tasks', time: '3h ago' },
];

const stats = [
  {
    label: 'Total users',
    value: '7,240',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    color: 'from-primary to-chart-4',
  },
  {
    label: 'Total volume (30d)',
    value: '$2.4M',
    change: '+18.2%',
    trend: 'up',
    icon: DollarSign,
    color: 'from-success to-chart-2',
  },
  {
    label: 'Active users (24h)',
    value: '3,812',
    change: '+5.4%',
    trend: 'up',
    icon: Activity,
    color: 'from-chart-4 to-chart-5',
  },
  {
    label: 'Failed transactions',
    value: '0.3%',
    change: '-0.1%',
    trend: 'down',
    icon: TrendingDown,
    color: 'from-warning to-destructive',
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

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Platform Overview
        </h1>
        <p className="text-sm text-muted-foreground">
          Real-time platform metrics and system health.
        </p>
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
                        stat.trend === 'up' ? 'text-success' : 'text-success'
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
        {/* User growth + revenue */}
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
                  User growth & revenue
                </h3>
                <p className="text-sm text-muted-foreground">
                  Last 7 months
                </p>
              </div>
              <div className="flex gap-4 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                  Users
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-chart-2" />
                  Revenue
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#usersGrad)" />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--chart-2))" strokeWidth={2} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Transaction distribution */}
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="p-6">
            <h3 className="font-display text-lg font-semibold">
              Transaction types
            </h3>
            <p className="text-sm text-muted-foreground">Distribution (30d)</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={transactionDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {transactionDistribution.map((entry, i) => (
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
              {transactionDistribution.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: cat.color }} />
                    {cat.name}
                  </span>
                  <span className="font-medium">{cat.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Service health + Recent activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Service health */}
        <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold">
                  Service health
                </h3>
                <p className="text-sm text-muted-foreground">
                  Microservices status
                </p>
              </div>
              <Server className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              {serviceHealth.map((service, i) => (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg',
                        service.status === 'healthy'
                          ? 'bg-success/10 text-success'
                          : 'bg-warning/10 text-warning'
                      )}
                    >
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium font-mono">{service.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {service.uptime} uptime · {service.latency} latency
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={cn(
                      service.status === 'healthy'
                        ? 'bg-success/10 text-success'
                        : 'bg-warning/10 text-warning'
                    )}
                  >
                    {service.status}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Recent activity */}
        <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible">
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold">
                  Recent activity
                </h3>
                <p className="text-sm text-muted-foreground">
                  Platform-wide events
                </p>
              </div>
              <Activity className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              {recentActivity.map((activity, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 rounded-lg px-3 py-2.5 hover:bg-muted/50"
                >
                  <div
                    className={cn(
                      'mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full',
                      activity.type === 'user' && 'bg-primary/10 text-primary',
                      activity.type === 'payment' && 'bg-success/10 text-success',
                      activity.type === 'kyc' && 'bg-chart-4/10 text-chart-4',
                      activity.type === 'alert' && 'bg-destructive/10 text-destructive',
                      activity.type === 'system' && 'bg-muted text-muted-foreground'
                    )}
                  >
                    {activity.type === 'user' && <Users className="h-4 w-4" />}
                    {activity.type === 'payment' && <DollarSign className="h-4 w-4" />}
                    {activity.type === 'kyc' && <ShieldCheck className="h-4 w-4" />}
                    {activity.type === 'alert' && <TrendingDown className="h-4 w-4" />}
                    {activity.type === 'system' && <Server className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.detail}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.time}
                  </span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Geographic distribution */}
      <motion.div custom={8} variants={fadeUp} initial="hidden" animate="visible">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold">
                Transaction volume by region
              </h3>
              <p className="text-sm text-muted-foreground">
                Geographic distribution (30d)
              </p>
            </div>
            <Globe className="h-5 w-5 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={[
                { name: 'North America', volume: 980000 },
                { name: 'Europe', volume: 720000 },
                { name: 'Asia Pacific', volume: 450000 },
                { name: 'Latin America', volume: 180000 },
                { name: 'Africa', volume: 95000 },
                { name: 'Middle East', volume: 125000 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
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
              <Bar dataKey="volume" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>
    </div>
  );
}
