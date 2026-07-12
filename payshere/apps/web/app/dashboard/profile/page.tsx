'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Upload,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  FileCheck,
  IdCard,
  Camera,
} from 'lucide-react';
import { Button } from '@workspace/ui';
import { Input } from '@workspace/ui';
import { Label } from '@workspace/ui';
import { Card } from '@workspace/ui';
import { Badge } from '@workspace/ui';
import { useToast } from '@workspace/ui';
import { cn } from '@workspace/ui';

const kycSteps = [
  { id: 1, label: 'Personal information', icon: User, status: 'completed' },
  { id: 2, label: 'Document verification', icon: IdCard, status: 'completed' },
  { id: 3, label: 'Address proof', icon: MapPin, status: 'pending' },
  { id: 4, label: 'Selfie verification', icon: Camera, status: 'not_started' },
  { id: 5, label: 'Final review', icon: ShieldCheck, status: 'not_started' },
];

export default function ProfilePage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah@flowcommerce.com',
    phone: '+1 (555) 123-4567',
    company: 'FlowCommerce Inc.',
    address: '350 5th Avenue, Suite 200',
    city: 'New York',
    state: 'NY',
    zip: '10118',
    country: 'United States',
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    toast({ title: 'Profile updated!', description: 'Your changes have been saved.' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Profile & KYC</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal info and verification status.
        </p>
      </div>

      {/* Profile header */}
      <Card className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200"
              alt="Profile"
              className="h-20 w-20 rounded-full object-cover"
            />
            <button className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white shadow-lg">
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl font-bold">{profile.firstName} {profile.lastName}</h2>
              <Badge className="bg-success/10 text-success">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Verified
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <p className="text-xs text-muted-foreground">Member since January 2024</p>
          </div>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Upload photo
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile form */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h3 className="mb-4 font-display text-lg font-semibold">Personal information</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-10"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="phone"
                      className="pl-10"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="company"
                    className="pl-10"
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="address"
                    className="pl-10"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={profile.state}
                    onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP</Label>
                  <Input
                    id="zip"
                    value={profile.zip}
                    onChange={(e) => setProfile({ ...profile, zip: e.target.value })}
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save changes'
                )}
              </Button>
            </form>
          </Card>
        </div>

        {/* KYC status */}
        <div className="space-y-4">
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h3 className="font-display text-lg font-semibold">KYC Verification</h3>
            </div>
            <div className="mb-4 flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <span className="text-sm text-muted-foreground">Overall status</span>
              <Badge className="bg-warning/10 text-warning">In progress</Badge>
            </div>
            <div className="space-y-3">
              {kycSteps.map((step, i) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-full',
                      step.status === 'completed'
                        ? 'bg-success/10 text-success'
                        : step.status === 'pending'
                        ? 'bg-warning/10 text-warning'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {step.status === 'completed' ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <step.icon className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{step.label}</p>
                    <p className="text-xs capitalize text-muted-foreground">
                      {step.status === 'not_started' ? 'Not started' : step.status}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            <Button className="mt-4 w-full" variant="outline">
              <FileCheck className="mr-2 h-4 w-4" />
              Continue verification
            </Button>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 to-chart-4/10 p-6">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <h3 className="mt-3 font-display text-base font-semibold">
              Why verification matters
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Complete KYC to unlock higher transaction limits, faster settlements, and advanced features.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
