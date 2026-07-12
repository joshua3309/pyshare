'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@workspace/ui';
import { cn } from '@workspace/ui';

const navLinks = [
  { href: '/#features', label: 'Features' },
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#testimonials', label: 'Customers' },
];

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isLanding = pathname === '/';

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'glass border-b border-border/60 shadow-premium'
            : 'bg-transparent'
        )}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="font-display text-lg font-bold tracking-tight">
              PaySphere
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-9 w-9"
            >
              {mounted && theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Link href="/login">
              <Button variant="ghost" className="text-sm font-medium">
                Sign in
              </Button>
            </Link>
            <Link href="/register">
              <Button className="text-sm font-medium">Get started</Button>
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-9 w-9"
            >
              {mounted && theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="h-9 w-9"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </nav>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="glass overflow-hidden border-b border-border md:hidden"
            >
              <div className="flex flex-col gap-4 px-4 py-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-base font-medium text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-2 pt-4">
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full">Get started</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}

function Logo() {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-chart-4 shadow-lg">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2L4 7v10l8 5 8-5V7l-8-5z"
          stroke="white"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M12 8v8M8 10l8 4M8 14l8-4"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
