'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Download,
  Send,
  MoreHorizontal,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  X,
  User,
  Mail,
  DollarSign,
  Loader2,
} from 'lucide-react';
import { Button } from '@workspace/ui';
import { Input } from '@workspace/ui';
import { Label } from '@workspace/ui';
import { Card } from '@workspace/ui';
import { Badge } from '@workspace/ui';
import { Textarea } from '@workspace/ui';
import { useToast } from '@workspace/ui';
import { cn } from '@workspace/ui';

const invoices = [
  { id: 'INV-1042', client: 'Acme Corp', amount: 8750, status: 'paid', dueDate: '2024-01-20', issueDate: '2024-01-06' },
  { id: 'INV-1041', client: 'Globex Inc', amount: 12300, status: 'paid', dueDate: '2024-01-18', issueDate: '2024-01-04' },
  { id: 'INV-1040', client: 'Initech', amount: 5400, status: 'pending', dueDate: '2024-01-25', issueDate: '2024-01-10' },
  { id: 'INV-1039', client: 'Umbrella LLC', amount: 2100, status: 'overdue', dueDate: '2024-01-12', issueDate: '2023-12-28' },
  { id: 'INV-1038', client: 'Hooli Inc', amount: 15600, status: 'paid', dueDate: '2024-01-15', issueDate: '2024-01-01' },
  { id: 'INV-1037', client: 'Soylent Co', amount: 3200, status: 'pending', dueDate: '2024-01-28', issueDate: '2024-01-13' },
  { id: 'INV-1036', client: 'Stark Industries', amount: 45000, status: 'paid', dueDate: '2024-01-10', issueDate: '2023-12-26' },
  { id: 'INV-1035', client: 'Wayne Enterprises', amount: 28000, status: 'draft', dueDate: '2024-02-01', issueDate: '2024-01-14' },
];

const statusConfig = {
  paid: { icon: CheckCircle2, color: 'bg-success/10 text-success', label: 'Paid' },
  pending: { icon: Clock, color: 'bg-warning/10 text-warning', label: 'Pending' },
  overdue: { icon: XCircle, color: 'bg-destructive/10 text-destructive', label: 'Overdue' },
  draft: { icon: FileText, color: 'bg-muted text-muted-foreground', label: 'Draft' },
};

export default function InvoicesPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ client: '', email: '', amount: '', note: '' });

  const filtered = invoices.filter(
    (inv) =>
      inv.client.toLowerCase().includes(search.toLowerCase()) ||
      inv.id.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    paid: invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + i.amount, 0),
    pending: invoices.filter((i) => i.status === 'pending').reduce((s, i) => s + i.amount, 0),
    overdue: invoices.filter((i) => i.status === 'overdue').reduce((s, i) => s + i.amount, 0),
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setLoading(false);
    setShowCreate(false);
    setFormData({ client: '', email: '', amount: '', note: '' });
    toast({ title: 'Invoice created!', description: `Invoice sent to ${formData.client}` });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Invoices</h1>
          <p className="text-sm text-muted-foreground">
            Create, send, and track invoices.
          </p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New invoice
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total billed', value: stats.total, color: 'text-foreground' },
          { label: 'Paid', value: stats.paid, color: 'text-success' },
          { label: 'Pending', value: stats.pending, color: 'text-warning' },
          { label: 'Overdue', value: stats.overdue, color: 'text-destructive' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={cn('mt-1 font-display text-xl font-bold', stat.color)}>
                ${stat.value.toLocaleString()}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search invoices..."
          className="max-w-md pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Invoices table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Invoice</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Client</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">Issue date</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Due date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((inv, i) => {
                const status = statusConfig[inv.status as keyof typeof statusConfig];
                return (
                  <motion.tr
                    key={inv.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{inv.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{inv.client}</td>
                    <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">{inv.issueDate}</td>
                    <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">{inv.dueDate}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className={status.color}>
                        <status.icon className="mr-1 h-3 w-3" />
                        {status.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold">
                      ${inv.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create invoice modal */}
      <AnimatePresence>
        {showCreate && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold">New invoice</h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowCreate(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="client">Client name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="client"
                        placeholder="Acme Corp"
                        className="pl-10"
                        value={formData.client}
                        onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-email">Client email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="client-email"
                        type="email"
                        placeholder="billing@acme.com"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoice-amount">Amount</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="invoice-amount"
                        type="number"
                        placeholder="0.00"
                        className="pl-10"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoice-note">Description</Label>
                    <Textarea
                      id="invoice-note"
                      placeholder="What is this invoice for?"
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Create & send invoice
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
