'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@workspace/ui';
import { Input } from '@workspace/ui';
import { Card } from '@workspace/ui';
import { Badge } from '@workspace/ui';
import { cn } from '@workspace/ui';

const allTransactions = [
  { id: 'TXN-001', name: 'Stripe payout', type: 'inflow', amount: 12400, date: '2024-01-15', status: 'completed', method: 'Bank transfer' },
  { id: 'TXN-002', name: 'AWS Services', type: 'outflow', amount: 3200, date: '2024-01-14', status: 'completed', method: 'Card' },
  { id: 'TXN-003', name: 'Client invoice #1042', type: 'inflow', amount: 8750, date: '2024-01-13', status: 'completed', method: 'ACH' },
  { id: 'TXN-004', name: 'Office rent', type: 'outflow', amount: 4500, date: '2024-01-12', status: 'pending', method: 'Bank transfer' },
  { id: 'TXN-005', name: 'Figma subscription', type: 'outflow', amount: 45, date: '2024-01-11', status: 'completed', method: 'Card' },
  { id: 'TXN-006', name: 'PayPal transfer', type: 'inflow', amount: 2300, date: '2024-01-10', status: 'completed', method: 'PayPal' },
  { id: 'TXN-007', name: 'Google Ads', type: 'outflow', amount: 1200, date: '2024-01-09', status: 'completed', method: 'Card' },
  { id: 'TXN-008', name: 'Client payment - Acme', type: 'inflow', amount: 15600, date: '2024-01-08', status: 'completed', method: 'Wire' },
  { id: 'TXN-009', name: 'Slack subscription', type: 'outflow', amount: 75, date: '2024-01-07', status: 'completed', method: 'Card' },
  { id: 'TXN-010', name: 'Refund - Customer #2841', type: 'outflow', amount: 299, date: '2024-01-06', status: 'pending', method: 'Card' },
  { id: 'TXN-011', name: 'Stripe payout', type: 'inflow', amount: 9800, date: '2024-01-05', status: 'completed', method: 'Bank transfer' },
  { id: 'TXN-012', name: 'Notion subscription', type: 'outflow', amount: 96, date: '2024-01-04', status: 'completed', method: 'Card' },
];

const filters = ['all', 'inflow', 'outflow', 'pending'];
const statusFilters = ['all', 'completed', 'pending'];

export default function TransactionsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = useMemo(() => {
    return allTransactions.filter((txn) => {
      const matchesSearch = txn.name.toLowerCase().includes(search.toLowerCase()) || txn.id.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || txn.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || txn.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [search, typeFilter, statusFilter]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-sm text-muted-foreground">
            View and manage all your transactions.
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or transaction ID..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex rounded-lg border border-border p-1">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setTypeFilter(f)}
                  className={cn(
                    'rounded-md px-3 py-1 text-xs font-medium capitalize transition-all',
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
                    'rounded-md px-3 py-1 text-xs font-medium capitalize transition-all',
                    statusFilter === f
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Date range
            </Button>
          </div>
        </div>
      </Card>

      {/* Transactions table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Transaction
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">
                  Method
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Amount
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.map((txn, i) => (
                <motion.tr
                  key={txn.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="transition-colors hover:bg-muted/30"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex h-9 w-9 items-center justify-center rounded-full',
                          txn.type === 'inflow'
                            ? 'bg-success/10 text-success'
                            : 'bg-destructive/10 text-destructive'
                        )}
                      >
                        {txn.type === 'inflow' ? (
                          <ArrowDownLeft className="h-4 w-4" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{txn.name}</p>
                        <p className="text-xs text-muted-foreground">{txn.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">
                    {txn.method}
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">
                    {txn.date}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="secondary"
                      className={cn(
                        txn.status === 'completed'
                          ? 'bg-success/10 text-success'
                          : 'bg-warning/10 text-warning'
                      )}
                    >
                      {txn.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={cn(
                        'text-sm font-semibold',
                        txn.type === 'inflow' ? 'text-success' : 'text-foreground'
                      )}
                    >
                      {txn.type === 'inflow' ? '+' : '-'}${txn.amount.toLocaleString()}
                    </span>
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
            Showing {(page - 1) * perPage + 1} to{' '}
            {Math.min(page * perPage, filtered.length)} of {filtered.length} results
          </p>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={page === i + 1 ? 'default' : 'outline'}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
