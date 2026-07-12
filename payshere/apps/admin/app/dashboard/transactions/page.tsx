'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@workspace/ui';
import { Input } from '@workspace/ui';
import { Card } from '@workspace/ui';
import { Badge } from '@workspace/ui';
import { useToast } from '@workspace/ui';
import { cn } from '@workspace/ui';

interface AdminTransaction {
  id: string;
  reference: string;
  user: string;
  userEmail: string;
  type: 'PAYMENT' | 'TRANSFER' | 'DEPOSIT' | 'WITHDRAWAL' | 'REFUND';
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'PROCESSING';
  amount: number;
  currency: string;
  fee: number;
  date: string;
  method: string;
  flagged: boolean;
}

const mockTransactions: AdminTransaction[] = [
  { id: '1', reference: 'TXN-A1B2C3D4', user: 'Sarah Chen', userEmail: 'sarah@flowcommerce.com', type: 'PAYMENT', status: 'COMPLETED', amount: 12400, currency: 'USD', fee: 389.5, date: '2024-01-15 14:32', method: 'Bank transfer', flagged: false },
  { id: '2', reference: 'TXN-E5F6G7H8', user: 'Marcus Rodriguez', userEmail: 'marcus@devhub.com', type: 'TRANSFER', status: 'COMPLETED', amount: 45000, currency: 'USD', fee: 1305, date: '2024-01-15 13:15', method: 'Wire', flagged: true },
  { id: '3', reference: 'TXN-I9J0K1L2', user: 'Emily Watson', userEmail: 'emily@scaleup.io', type: 'DEPOSIT', status: 'COMPLETED', amount: 8750, currency: 'USD', fee: 0, date: '2024-01-15 11:42', method: 'ACH', flagged: false },
  { id: '4', reference: 'TXN-M3N4O5P6', user: 'Aisha Patel', userEmail: 'aisha@retail.io', type: 'WITHDRAWAL', status: 'PENDING', amount: 21000, currency: 'USD', fee: 630, date: '2024-01-15 10:08', method: 'Bank transfer', flagged: false },
  { id: '5', reference: 'TXN-Q7R8S9T0', user: 'Thomas Mueller', userEmail: 'thomas@worldgoods.com', type: 'PAYMENT', status: 'FAILED', amount: 3200, currency: 'EUR', fee: 0, date: '2024-01-15 09:33', method: 'Card', flagged: false },
  { id: '6', reference: 'TXN-U1V2W3X4', user: 'Lisa Anderson', userEmail: 'lisa@techcorp.com', type: 'REFUND', status: 'COMPLETED', amount: 299, currency: 'USD', fee: 0, date: '2024-01-14 16:20', method: 'Card', flagged: false },
  { id: '7', reference: 'TXN-Y5Z6A7B8', user: 'Maria Garcia', userEmail: 'maria@finserve.com', type: 'PAYMENT', status: 'COMPLETED', amount: 67500, currency: 'USD', fee: 1957.5, date: '2024-01-14 14:55', method: 'Wire', flagged: true },
  { id: '8', reference: 'TXN-C9D0E1F2', user: 'John Smith', userEmail: 'john@acme.com', type: 'TRANSFER', status: 'PROCESSING', amount: 1500, currency: 'GBP', fee: 45, date: '2024-01-14 12:30', method: 'SEPA', flagged: false },
  { id: '9', reference: 'TXN-G3H4I5J6', user: 'Sarah Chen', userEmail: 'sarah@flowcommerce.com', type: 'DEPOSIT', status: 'COMPLETED', amount: 5000, currency: 'USD', fee: 0, date: '2024-01-14 10:15', method: 'Card', flagged: false },
  { id: '10', reference: 'TXN-K7L8M9N0', user: 'Marcus Rodriguez', userEmail: 'marcus@devhub.com', type: 'WITHDRAWAL', status: 'COMPLETED', amount: 12000, currency: 'USD', fee: 360, date: '2024-01-13 15:42', method: 'Bank transfer', flagged: false },
];

const typeFilters = ['all', 'PAYMENT', 'TRANSFER', 'DEPOSIT', 'WITHDRAWAL', 'REFUND'];
const statusFilters = ['all', 'COMPLETED', 'PENDING', 'PROCESSING', 'FAILED'];

const statusConfig: Record<string, { color: string }> = {
  COMPLETED: { color: 'bg-success/10 text-success' },
  PENDING: { color: 'bg-warning/10 text-warning' },
  PROCESSING: { color: 'bg-primary/10 text-primary' },
  FAILED: { color: 'bg-destructive/10 text-destructive' },
};

export default function AdminTransactionsPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = useMemo(() => {
    return mockTransactions.filter((txn) => {
      const matchesSearch =
        txn.reference.toLowerCase().includes(search.toLowerCase()) ||
        txn.user.toLowerCase().includes(search.toLowerCase()) ||
        txn.userEmail.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || txn.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || txn.status === statusFilter;
      const matchesFlagged = !showFlaggedOnly || txn.flagged;
      return matchesSearch && matchesType && matchesStatus && matchesFlagged;
    });
  }, [search, typeFilter, statusFilter, showFlaggedOnly]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const stats = {
    totalVolume: mockTransactions.filter((t) => t.status === 'COMPLETED').reduce((s, t) => s + t.amount, 0),
    totalFees: mockTransactions.filter((t) => t.status === 'COMPLETED').reduce((s, t) => s + t.fee, 0),
    flagged: mockTransactions.filter((t) => t.flagged).length,
    failed: mockTransactions.filter((t) => t.status === 'FAILED').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">All Transactions</h1>
          <p className="text-sm text-muted-foreground">
            Monitor all platform transactions in real-time.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => toast({ title: 'Export started', description: 'Transactions exporting as CSV.' })}>
          <Download className="mr-2 h-4 w-4" />
          Export all
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total volume', value: `$${(stats.totalVolume / 1000).toFixed(0)}k`, icon: DollarSign, color: 'text-primary' },
          { label: 'Fees collected', value: `$${stats.totalFees.toFixed(0)}`, icon: TrendingUp, color: 'text-success' },
          { label: 'Flagged', value: stats.flagged, icon: AlertTriangle, color: 'text-warning' },
          { label: 'Failed', value: stats.failed, icon: TrendingUp, color: 'text-destructive' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 font-display text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={cn('h-6 w-6', stat.color)} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by reference, user, or email..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFlaggedOnly(!showFlaggedOnly)}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all',
                showFlaggedOnly
                  ? 'border-warning/30 bg-warning/10 text-warning'
                  : 'border-border text-muted-foreground hover:text-foreground'
              )}
            >
              <AlertTriangle className="h-4 w-4" />
              Flagged only
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex rounded-lg border border-border p-1">
              {typeFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setTypeFilter(f)}
                  className={cn(
                    'rounded-md px-3 py-1 text-xs font-medium transition-all',
                    typeFilter === f
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex rounded-lg border border-border p-1">
              {statusFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={cn(
                    'rounded-md px-3 py-1 text-xs font-medium transition-all',
                    statusFilter === f
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Transactions table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reference</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">User</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Method</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">Date</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
                <th className="hidden px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">Fee</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.map((txn, i) => (
                <motion.tr
                  key={txn.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className={cn(
                    'transition-colors hover:bg-muted/30',
                    txn.flagged && 'bg-warning/5'
                  )}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-full',
                          ['PAYMENT', 'DEPOSIT'].includes(txn.type)
                            ? 'bg-success/10 text-success'
                            : 'bg-destructive/10 text-destructive'
                        )}
                      >
                        {['PAYMENT', 'DEPOSIT'].includes(txn.type) ? (
                          <ArrowDownLeft className="h-4 w-4" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-mono font-medium">{txn.reference}</p>
                        {txn.flagged && (
                          <p className="flex items-center gap-1 text-xs text-warning">
                            <AlertTriangle className="h-3 w-3" />
                            Flagged
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium">{txn.user}</p>
                    <p className="text-xs text-muted-foreground">{txn.userEmail}</p>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <Badge variant="outline">{txn.type}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className={statusConfig[txn.status].color}>
                      {txn.status}
                    </Badge>
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">
                    {txn.method}
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-muted-foreground lg:table-cell">
                    {txn.date}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={cn(
                      'text-sm font-semibold',
                      ['PAYMENT', 'DEPOSIT'].includes(txn.type) ? 'text-success' : 'text-foreground'
                    )}>
                      {['PAYMENT', 'DEPOSIT'].includes(txn.type) ? '+' : '-'}${txn.amount.toLocaleString()}
                    </span>
                    <p className="text-xs text-muted-foreground">{txn.currency}</p>
                  </td>
                  <td className="hidden px-4 py-3 text-right text-sm text-muted-foreground lg:table-cell">
                    ${txn.fee.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, filtered.length)} of {filtered.length} transactions
          </p>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {[...Array(totalPages)].map((_, i) => (
              <Button key={i} variant={page === i + 1 ? 'default' : 'outline'} size="sm" className="h-8 w-8 p-0" onClick={() => setPage(i + 1)}>
                {i + 1}
              </Button>
            ))}
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
