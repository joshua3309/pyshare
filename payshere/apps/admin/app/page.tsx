'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  ArrowLeft,
  Copy,
  Check,
  RefreshCw,
  KeyRound,
} from 'lucide-react';
import { Button } from '@workspace/ui';
import { Input } from '@workspace/ui';
import { Label } from '@workspace/ui';
import { Card } from '@workspace/ui';
import { useToast } from '@workspace/ui';
import { cn } from '@workspace/ui';

/**
 * Generates a random admin email and password.
 * Format: admin_<6-char-hex>@paysphere.admin / <16-char-alphanumeric>
 */
function generateAdminCredentials() {
  const hex = Math.random().toString(16).substring(2, 8);
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < 16; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return {
    email: `admin_${hex}@paysphere.admin`,
    password,
  };
}

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [copied, setCopied] = useState<'email' | 'password' | null>(null);
  const [showCredentials, setShowCredentials] = useState(true);

  // Generate credentials on mount
  useEffect(() => {
    setCredentials(generateAdminCredentials());
  }, []);

  const handleRegenerate = () => {
    setCredentials(generateAdminCredentials());
    setFormData({ email: '', password: '' });
    setShowCredentials(true);
    toast({
      title: 'New credentials generated',
      description: 'Use the new email and password below to sign in.',
    });
  };

  const copyToClipboard = (field: 'email' | 'password') => {
    navigator.clipboard.writeText(credentials[field]);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleUseCredentials = () => {
    setFormData({ email: credentials.email, password: credentials.password });
    setShowCredentials(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Validate against generated credentials
    if (formData.email === credentials.email && formData.password === credentials.password) {
      toast({
        title: 'Admin access granted',
        description: 'Welcome to the PaySphere admin panel.',
      });
      router.push('/dashboard');
    } else {
      setLoading(false);
      toast({
        title: 'Invalid credentials',
        description: 'Please use the generated admin credentials.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-mesh px-4 py-12">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
      <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px] animate-pulse-glow" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <a href="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-chart-4 shadow-lg">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-xl font-bold">PaySphere Admin</span>
        </a>

        <Card className="overflow-hidden p-0 shadow-premium-lg">
          {/* Header */}
          <div className="border-b border-border bg-gradient-to-br from-primary/5 to-chart-4/5 p-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <KeyRound className="h-7 w-7 text-primary" />
            </div>
            <h1 className="mt-3 font-display text-2xl font-bold tracking-tight">
              Admin Portal
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Secure access for platform administrators
            </p>
          </div>

          <div className="p-6">
            {/* Generated credentials banner */}
            <AnimatePresence>
              {showCredentials && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                        Generated Admin Credentials
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRegenerate}
                        className="h-7 px-2 text-xs"
                      >
                        <RefreshCw className="mr-1 h-3 w-3" />
                        Regenerate
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 rounded-lg bg-card p-2.5">
                        <Mail className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        <code className="flex-1 truncate text-xs font-mono">
                          {credentials.email}
                        </code>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('email')}
                          className="flex-shrink-0 text-muted-foreground hover:text-foreground"
                        >
                          {copied === 'email' ? (
                            <Check className="h-3.5 w-3.5 text-success" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-card p-2.5">
                        <Lock className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        <code className="flex-1 truncate text-xs font-mono">
                          {credentials.password}
                        </code>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('password')}
                          className="flex-shrink-0 text-muted-foreground hover:text-foreground"
                        >
                          {copied === 'password' ? (
                            <Check className="h-3.5 w-3.5 text-success" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-3 w-full"
                      onClick={handleUseCredentials}
                    >
                      Use these credentials
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Admin email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin_xxxxxx@paysphere.admin"
                    className="pl-10 font-mono text-sm"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Admin password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter admin password"
                    className="pl-10 pr-10 font-mono text-sm"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Access admin panel
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 flex items-center justify-center">
              <a
                href="/"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to home
              </a>
            </div>
          </div>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Admin credentials are randomly generated for each session.
          <br />
          Store them securely — they cannot be recovered.
        </p>
      </motion.div>
    </div>
  );
}
