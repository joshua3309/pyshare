'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@workspace/ui';
import { Input } from '@workspace/ui';
import { Label } from '@workspace/ui';
import { useToast } from '@workspace/ui';
import { AuthLayout } from '@/components/auth/auth-layout';

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setLoading(false);
    setSent(true);
    toast({
      title: 'Reset link sent',
      description: 'Check your email for password reset instructions.',
    });
  };

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a link to reset your password."
    >
      {sent ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <h3 className="mt-4 font-display text-xl font-semibold">
            Check your email
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            We&apos;ve sent a password reset link to{' '}
            <span className="font-medium text-foreground">{email}</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            The link will expire in 30 minutes.
          </p>
          <Link href="/login">
            <Button variant="outline" className="mt-6 w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to sign in
            </Button>
          </Link>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending link...
              </>
            ) : (
              'Send reset link'
            )}
          </Button>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </form>
      )}
    </AuthLayout>
  );
}
