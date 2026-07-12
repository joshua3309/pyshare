'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Check,
  Building2,
} from 'lucide-react';
import { Button } from '@workspace/ui';
import { Input } from '@workspace/ui';
import { Label } from '@workspace/ui';
import { useToast } from '@workspace/ui';
import { AuthLayout } from '@/components/auth/auth-layout';
import { cn } from '@workspace/ui';

const passwordRequirements = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p: string) => /\d/.test(p) },
  { label: 'One special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    password: '',
  });

  const passwordStrength = passwordRequirements.filter((req) =>
    req.test(formData.password)
  ).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    toast({
      title: 'Account created!',
      description: 'Check your email to verify your account.',
    });
    router.push('/dashboard');
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start accepting payments in minutes. No credit card required."
    >
      {/* Progress indicator */}
      <div className="mb-8 flex items-center gap-2">
        {[1, 2].map((s) => (
          <div
            key={s}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-all',
              s <= step ? 'bg-primary' : 'bg-muted'
            )}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="firstName"
                      placeholder="John"
                      className="pl-10"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Work email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="company"
                    placeholder="Acme Inc."
                    className="pl-10"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                  />
                </div>
              </div>

              <Button
                type="button"
                className="w-full"
                onClick={() => setStep(2)}
              >
                Continue
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="space-y-2">
                <Label htmlFor="password">Create password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    className="pl-10 pr-10"
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

                {/* Password strength meter */}
                {formData.password && (
                  <div className="mt-3 space-y-2">
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            'h-1 flex-1 rounded-full transition-all',
                            i < passwordStrength
                              ? passwordStrength === 1
                                ? 'bg-destructive'
                                : passwordStrength === 2
                                ? 'bg-warning'
                                : passwordStrength === 3
                                ? 'bg-primary'
                                : 'bg-success'
                              : 'bg-muted'
                          )}
                        />
                      ))}
                    </div>
                    <div className="space-y-1">
                      {passwordRequirements.map((req) => (
                        <div
                          key={req.label}
                          className="flex items-center gap-2 text-xs"
                        >
                          <div
                            className={cn(
                              'flex h-3.5 w-3.5 items-center justify-center rounded-full',
                              req.test(formData.password)
                                ? 'bg-success text-white'
                                : 'bg-muted'
                            )}
                          >
                            {req.test(formData.password) && (
                              <Check className="h-2.5 w-2.5" />
                            )}
                          </div>
                          <span
                            className={cn(
                              req.test(formData.password)
                                ? 'text-foreground'
                                : 'text-muted-foreground'
                            )}
                          >
                            {req.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 h-4 w-4 rounded border-border"
                  required
                />
                <Label htmlFor="terms" className="text-sm text-muted-foreground">
                  I agree to the{' '}
                  <Link href="#" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create account'
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

