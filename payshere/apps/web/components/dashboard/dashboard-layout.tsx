'use client';

import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Receipt,
  User,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  Moon,
  Sun,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@workspace/ui';
import { Input } from '@workspace/ui';
import { cn } from '@workspace/ui';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/send', label: 'Send money', icon: ArrowUpRight },
  { href: '/dashboard/request', label: 'Request money', icon: ArrowDownLeft },
  { href: '/dashboard/wallet', label: 'Wallet', icon: Wallet },
  { href: '/dashboard/transactions', label: 'Transactions', icon: Receipt },
  { href: '/dashboard/invoices', label: 'Invoices', icon: Receipt },
  { href: '/dashboard/profile', label: 'Profile & KYC', icon: User },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-border bg-card lg:block">
        <SidebarContent pathname={pathname} />
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
              <SidebarContent
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
            <Input
              placeholder="Search transactions, invoices..."
              className="pl-10"
            />
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
              <img
                src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150"
                alt="User"
                className="h-7 w-7 rounded-full object-cover"
              />
              <div className="hidden text-left sm:block">
                <p className="text-xs font-semibold">Sarah Chen</p>
                <p className="text-xs text-muted-foreground">Pro plan</p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L4 7v10l8 5 8-5V7l-8-5z"
                stroke="white"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="font-display text-lg font-bold">PaySphere</span>
        </Link>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const active =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);
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
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <div className="rounded-xl bg-gradient-to-br from-primary/10 to-chart-4/10 p-4">
          <p className="text-sm font-semibold">Upgrade to Enterprise</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Get custom pricing and dedicated support.
          </p>
          <Button size="sm" className="mt-3 w-full">
            Upgrade
          </Button>
        </div>
        <Link
          href="/login"
          className="mt-3 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Link>
      </div>
    </div>
  );
}
