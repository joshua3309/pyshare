'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Lock,
  Globe,
  CreditCard,
  Trash2,
  Loader2,
  Moon,
  Sun,
  Monitor,
} from 'lucide-react';
import { Button } from '@workspace/ui';
import { Input } from '@workspace/ui';
import { Label } from '@workspace/ui';
import { Card } from '@workspace/ui';
import { Switch } from '@workspace/ui';
import { useToast } from '@workspace/ui';
import { cn } from '@workspace/ui';

const tabs = [
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'appearance', label: 'Appearance', icon: Sun },
  { id: 'payment', label: 'Payment methods', icon: CreditCard },
  { id: 'danger', label: 'Danger zone', icon: Trash2 },
];

export default function SettingsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('notifications');
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    transactions: true,
    marketing: false,
    security: true,
  });

  const handleSave = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
    toast({ title: 'Settings saved!', description: 'Your preferences have been updated.' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account preferences and configuration.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Tabs sidebar */}
        <div className="lg:col-span-1">
          <nav className="flex gap-1 overflow-x-auto lg:flex-col">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all whitespace-nowrap',
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {activeTab === 'notifications' && (
              <Card className="p-6">
                <h3 className="font-display text-lg font-semibold">Notification preferences</h3>
                <p className="text-sm text-muted-foreground">
                  Choose how you want to be notified.
                </p>
                <div className="mt-6 space-y-4">
                  {[
                    { key: 'email', label: 'Email notifications', desc: 'Receive updates via email' },
                    { key: 'push', label: 'Push notifications', desc: 'Get push alerts on your devices' },
                    { key: 'transactions', label: 'Transaction alerts', desc: 'Notify me about every transaction' },
                    { key: 'security', label: 'Security alerts', desc: 'Important security-related notifications' },
                    { key: 'marketing', label: 'Marketing emails', desc: 'Product updates and promotional offers' },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between rounded-lg border border-border p-4"
                    >
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch
                        checked={notifications[item.key as keyof typeof notifications]}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, [item.key]: checked })
                        }
                      />
                    </div>
                  ))}
                </div>
                <Button className="mt-6" onClick={handleSave} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save preferences'
                  )}
                </Button>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card className="p-6">
                <h3 className="font-display text-lg font-semibold">Security</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your password and security settings.
                </p>
                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current password</Label>
                    <Input id="current-password" type="password" placeholder="••••••••" />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New password</Label>
                      <Input id="new-password" type="password" placeholder="••••••••" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-new">Confirm password</Label>
                      <Input id="confirm-new" type="password" placeholder="••••••••" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="text-sm font-medium">Two-factor authentication</p>
                      <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Button onClick={handleSave} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update password'
                    )}
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === 'appearance' && (
              <Card className="p-6">
                <h3 className="font-display text-lg font-semibold">Appearance</h3>
                <p className="text-sm text-muted-foreground">
                  Customize how PaySphere looks for you.
                </p>
                <div className="mt-6 grid grid-cols-3 gap-4">
                  {[
                    { icon: Sun, label: 'Light', value: 'light' },
                    { icon: Moon, label: 'Dark', value: 'dark' },
                    { icon: Monitor, label: 'System', value: 'system' },
                  ].map((theme) => (
                    <button
                      key={theme.value}
                      className="flex flex-col items-center gap-2 rounded-xl border border-border p-4 transition-all hover:border-primary"
                    >
                      <theme.icon className="h-6 w-6" />
                      <span className="text-sm font-medium">{theme.label}</span>
                    </button>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === 'payment' && (
              <Card className="p-6">
                <h3 className="font-display text-lg font-semibold">Payment methods</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your cards and bank accounts.
                </p>
                <div className="mt-6 space-y-3">
                  {[
                    { brand: 'Visa', last4: '4242', exp: '12/26', default: true },
                    { brand: 'Mastercard', last4: '5555', exp: '08/25', default: false },
                  ].map((card) => (
                    <div
                      key={card.last4}
                      className="flex items-center justify-between rounded-lg border border-border p-4"
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-6 w-6 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">
                            {card.brand} ****{card.last4}
                          </p>
                          <p className="text-xs text-muted-foreground">Expires {card.exp}</p>
                        </div>
                      </div>
                      {card.default && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          Default
                        </span>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Add payment method
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === 'danger' && (
              <Card className="border-destructive/30 p-6">
                <h3 className="font-display text-lg font-semibold text-destructive">
                  Danger zone
                </h3>
                <p className="text-sm text-muted-foreground">
                  Irreversible and destructive actions.
                </p>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-destructive/30 p-4">
                    <div>
                      <p className="text-sm font-medium">Export all data</p>
                      <p className="text-xs text-muted-foreground">
                        Download a copy of all your data
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Export
                    </Button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-destructive/30 p-4">
                    <div>
                      <p className="text-sm font-medium text-destructive">Delete account</p>
                      <p className="text-xs text-muted-foreground">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
