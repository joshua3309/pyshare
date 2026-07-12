'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Loader2, Check } from 'lucide-react';
import { Button } from '@workspace/ui';
import { Input } from '@workspace/ui';
import { Label } from '@workspace/ui';
import { useToast } from '@workspace/ui';
import { AuthLayout } from '@/components/auth/auth-layout';
import { cn } from '@workspace/ui';

const requirements = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p: string) => /\d/.test(p) },
  { label: 'One special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function ResetPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const strength = requirements.filter((r) => r.test(password)).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure both passwords are identical.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    toast({
      title: 'Password reset!',
      description: 'Your password has been updated successfully.',
    });
    router.push('/login');
  };

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Enter your new password below to regain access to your account."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              className="pl-10 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          {password && (
            <div className="mt-3 space-y-2">
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1 flex-1 rounded-full transition-all',
                      i < strength
                        ? strength === 1
                          ? 'bg-destructive'
                          : strength === 2
                          ? 'bg-warning'
                          : strength === 3
                          ? 'bg-primary'
                          : 'bg-success'
                        : 'bg-muted'
                    )}
                  />
                ))}
              </div>
              {requirements.map((req) => (
                <div key={req.label} className="flex items-center gap-2 text-xs">
                  <div
                    className={cn(
                      'flex h-3.5 w-3.5 items-center justify-center rounded-full',
                      req.test(password) ? 'bg-success text-white' : 'bg-muted'
                    )}
                  >
                    {req.test(password) && <Check className="h-2.5 w-2.5" />}
                  </div>
                  <span
                    className={cn(
                      req.test(password)
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    )}
                  >
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Re-enter your password"
              className="pl-10"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {confirmPassword && password !== confirmPassword && (
            <p className="text-xs text-destructive">Passwords do not match</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resetting password...
            </>
          ) : (
            'Reset password'
          )}
        </Button>

        <Link
          href="/login"
          className="block text-center text-sm text-muted-foreground hover:text-foreground"
        >
          Back to sign in
        </Link>
      </form>
    </AuthLayout>
  );
}
