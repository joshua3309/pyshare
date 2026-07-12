'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Users,
  MoreHorizontal,
  Ban,
  CheckCircle2,
  Trash2,
  Mail,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
} from 'lucide-react';
import { Button } from '@workspace/ui';
import { Input } from '@workspace/ui';
import { Card } from '@workspace/ui';
import { Badge } from '@workspace/ui';
import { useToast } from '@workspace/ui';
import { cn } from '@workspace/ui';

type UserStatus = 'active' | 'suspended' | 'pending';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'MERCHANT';
  status: UserStatus;
  kycStatus: 'VERIFIED' | 'PENDING' | 'IN_REVIEW' | 'REJECTED';
  balance: number;
  joinedAt: string;
  lastActive: string;
  avatar: string;
}

const mockUsers: AdminUser[] = [
  { id: 'USR-001', name: 'Sarah Chen', email: 'sarah@flowcommerce.com', role: 'ADMIN', status: 'active', kycStatus: 'VERIFIED', balance: 248590.5, joinedAt: '2024-01-15', lastActive: '2m ago', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'USR-002', name: 'Marcus Rodriguez', email: 'marcus@devhub.com', role: 'MERCHANT', status: 'active', kycStatus: 'VERIFIED', balance: 84200, joinedAt: '2024-01-14', lastActive: '15m ago', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'USR-003', name: 'Emily Watson', email: 'emily@scaleup.io', role: 'USER', status: 'active', kycStatus: 'VERIFIED', balance: 45200, joinedAt: '2024-01-13', lastActive: '1h ago', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'USR-004', name: 'David Kim', email: 'david@studiokit.com', role: 'USER', status: 'suspended', kycStatus: 'REJECTED', balance: 0, joinedAt: '2024-01-12', lastActive: '3d ago', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'USR-005', name: 'Aisha Patel', email: 'aisha@retail.io', role: 'MERCHANT', status: 'active', kycStatus: 'IN_REVIEW', balance: 156000, joinedAt: '2024-01-11', lastActive: '30m ago', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'USR-006', name: 'Thomas Mueller', email: 'thomas@worldgoods.com', role: 'USER', status: 'active', kycStatus: 'PENDING', balance: 32000, joinedAt: '2024-01-10', lastActive: '2h ago', avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'USR-007', name: 'John Smith', email: 'john@acme.com', role: 'USER', status: 'pending', kycStatus: 'PENDING', balance: 0, joinedAt: '2024-01-09', lastActive: '5h ago', avatar: 'https://images.pexels.com/photos/1221516/pexels-photo-1221516.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'USR-008', name: 'Lisa Anderson', email: 'lisa@techcorp.com', role: 'MERCHANT', status: 'active', kycStatus: 'VERIFIED', balance: 92000, joinedAt: '2024-01-08', lastActive: '45m ago', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'USR-009', name: 'Robert Chang', email: 'robert@innovate.com', role: 'USER', status: 'suspended', kycStatus: 'REJECTED', balance: 1200, joinedAt: '2024-01-07', lastActive: '1w ago', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'USR-010', name: 'Maria Garcia', email: 'maria@finserve.com', role: 'USER', status: 'active', kycStatus: 'VERIFIED', balance: 67500, joinedAt: '2024-01-06', lastActive: '20m ago', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150' },
];

const statusFilters: ('all' | UserStatus)[] = ['all', 'active', 'suspended', 'pending'];
const roleFilters = ['all', 'USER', 'ADMIN', 'MERCHANT'];

const statusConfig: Record<UserStatus, { color: string; label: string }> = {
  active: { color: 'bg-success/10 text-success', label: 'Active' },
  suspended: { color: 'bg-destructive/10 text-destructive', label: 'Suspended' },
  pending: { color: 'bg-warning/10 text-warning', label: 'Pending' },
};

const kycConfig: Record<string, { color: string; label: string }> = {
  VERIFIED: { color: 'bg-success/10 text-success', label: 'Verified' },
  PENDING: { color: 'bg-muted text-muted-foreground', label: 'Pending' },
  IN_REVIEW: { color: 'bg-warning/10 text-warning', label: 'In Review' },
  REJECTED: { color: 'bg-destructive/10 text-destructive', label: 'Rejected' },
};

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | UserStatus>('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState(mockUsers);
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const perPage = 8;

  const filtered = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [search, statusFilter, roleFilter, users]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const handleSuspend = (id: string) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: 'suspended' as UserStatus } : u)));
    setActionMenu(null);
    toast({ title: 'User suspended', description: `User ${id} has been suspended.`, variant: 'destructive' });
  };

  const handleActivate = (id: string) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: 'active' as UserStatus } : u)));
    setActionMenu(null);
    toast({ title: 'User activated', description: `User ${id} has been reactivated.` });
  };

  const handleDelete = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
    setActionMenu(null);
    toast({ title: 'User deleted', description: `User ${id} has been permanently deleted.`, variant: 'destructive' });
  };

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === 'active').length,
    suspended: users.filter((u) => u.status === 'suspended').length,
    pending: users.filter((u) => u.status === 'pending').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">User Management</h1>
        <p className="text-sm text-muted-foreground">
          View, search, and manage all platform users.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total users', value: stats.total, icon: Users, color: 'text-primary' },
          { label: 'Active', value: stats.active, icon: UserCheck, color: 'text-success' },
          { label: 'Suspended', value: stats.suspended, icon: UserX, color: 'text-destructive' },
          { label: 'Pending', value: stats.pending, icon: ShieldAlert, color: 'text-warning' },
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
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or user ID..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
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
            <div className="flex rounded-lg border border-border p-1">
              {roleFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setRoleFilter(f)}
                  className={cn(
                    'rounded-md px-3 py-1 text-xs font-medium transition-all',
                    roleFilter === f
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

      {/* Users table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">User</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">KYC</th>
                <th className="hidden px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">Balance</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">Last active</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="transition-colors hover:bg-muted/30"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="h-9 w-9 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <Badge variant="outline" className={cn(
                      user.role === 'ADMIN' && 'border-primary/30 bg-primary/10 text-primary',
                      user.role === 'MERCHANT' && 'border-chart-4/30 bg-chart-4/10 text-chart-4',
                    )}>
                      {user.role === 'ADMIN' && <ShieldCheck className="mr-1 h-3 w-3" />}
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className={statusConfig[user.status].color}>
                      {statusConfig[user.status].label}
                    </Badge>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <Badge variant="secondary" className={kycConfig[user.kycStatus].color}>
                      {kycConfig[user.kycStatus].label}
                    </Badge>
                  </td>
                  <td className="hidden px-4 py-3 text-right text-sm font-semibold lg:table-cell">
                    ${user.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-muted-foreground lg:table-cell">
                    {user.lastActive}
                  </td>
                  <td className="px-4 py-3 text-right relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setActionMenu(actionMenu === user.id ? null : user.id)}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                    <AnimatePresence>
                      {actionMenu === user.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-4 top-12 z-50 w-48 rounded-lg border border-border bg-popover shadow-premium-lg"
                        >
                          <div className="p-1">
                            {user.status === 'active' ? (
                              <button
                                onClick={() => handleSuspend(user.id)}
                                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                              >
                                <Ban className="h-4 w-4" />
                                Suspend user
                              </button>
                            ) : (
                              <button
                                onClick={() => handleActivate(user.id)}
                                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-success hover:bg-success/10"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                Activate user
                              </button>
                            )}
                            <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted">
                              <Mail className="h-4 w-4" />
                              Send email
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete user
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, filtered.length)} of {filtered.length} users
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
