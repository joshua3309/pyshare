'use client';

import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Receipt,
  ShieldCheck,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  Moon,
  Sun,
  LogOut,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@workspace/ui';
import { Input } from '@workspace/ui';
import { Badge } from '@workspace/ui';
import { cn } from '@workspace/ui';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/users', label: 'Users', icon: Users },
  { href: '/dashboard/transactions', label: 'Transactions', icon: Receipt },
  { href: '/dashboard/kyc', label: 'KYC Review', icon: ShieldCheck, badge: 4 },
  { href: '/dashboard/settings', label: 'Platform Settings', icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-border bg-card lg:block">
        <AdminSidebarContent pathname={pathname} />
      </aside>

      {/* Sidebar - Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-50 h-screen w-64 border-r border-border bg-card lg:hidden"
            >
              <AdminSidebarContent
                pathname={pathname}
                onClose={() => setSidebarOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card/80 px-4 backdrop-blur sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="relative hidden flex-1 sm:block sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search users, transactions..." className="pl-10" />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {mounted && theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
            </Button>
            <div className="flex items-center gap-2 rounded-lg border border-border px-2 py-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                <ShieldCheck className="h-4 w-4 text-primary" />
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-semibold">Admin</p>
                <p className="text-xs text-muted-foreground">Super user</p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </header>

        {/* Admin banner */}
        <div className="flex items-center gap-2 border-b border-warning/30 bg-warning/10 px-4 py-2 text-xs text-warning sm:px-6 lg:px-8">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span className="font-medium">
            Admin mode — actions affect all platform users. Proceed with caution.
          </span>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function AdminSidebarContent({
  pathname,
  onClose,
}: {
  pathname: string;
  onClose?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-chart-4">
            <ShieldCheck className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="font-display text-base font-bold">PaySphere</span>
            <span className="ml-1 text-xs font-medium text-primary">Admin</span>
          </div>
        </Link>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.badge && (
                <Badge className="ml-auto bg-destructive/10 text-destructive">
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <div className="rounded-xl bg-gradient-to-br from-primary/10 to-chart-4/10 p-4">
          <p className="text-sm font-semibold">System status</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs text-muted-foreground">All systems operational</span>
          </div>
        </div>
        <Link
          href="/"
          className="mt-3 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Exit admin
        </Link>
      </div>
    </div>
  );
}
