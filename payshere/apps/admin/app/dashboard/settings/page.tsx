'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  DollarSign,
  Globe,
  Shield,
  Server,
  Bell,
  Loader2,
  Save,
  Lock,
  Percent,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { Button } from '@workspace/ui';
import { Input } from '@workspace/ui';
import { Label } from '@workspace/ui';
import { Card } from '@workspace/ui';
import { Switch } from '@workspace/ui';
import { Badge } from '@workspace/ui';
import { useToast } from '@workspace/ui';
import { cn } from '@workspace/ui';

const tabs = [
  { id: 'fees', label: 'Fee Structure', icon: DollarSign },
  { id: 'platform', label: 'Platform', icon: Globe },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'services', label: 'Services', icon: Server },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('fees');
  const [loading, setLoading] = useState(false);
  const [fees, setFees] = useState({
    paymentPercent: 2.9,
    paymentFixed: 0.3,
    transferPercent: 1.5,
    transferFixed: 0.0,
    withdrawalPercent: 1.0,
    withdrawalFixed: 0.5,
    currencyConversion: 0.5,
  });
  const [platform, setPlatform] = useState({
    maintenanceMode: false,
    newRegistrations: true,
    maxTransactionAmount: 100000,
    supportedCurrencies: 'USD, EUR, GBP, JPY, CAD, AUD',
    minKycLevel: 'BASIC',
  });
  const [security, setSecurity] = useState({
    twoFactorRequired: true,
    ipWhitelist: '',
    rateLimitPerMin: 1000,
    autoSuspendFailedLogins: 5,
    encryptionLevel: 'AES-256',
  });
  const [services, setServices] = useState({
    auth: true,
    user: true,
    payment: true,
    transaction: true,
    wallet: true,
    notification: true,
    billing: true,
  });

  const handleSave = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    toast({ title: 'Settings saved', description: 'Platform configuration has been updated.' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Platform Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure platform-wide settings, fees, and security policies.
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
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {activeTab === 'fees' && (
              <Card className="p-6">
                <div className="mb-6">
                  <h3 className="font-display text-lg font-semibold">Fee Structure</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure transaction fees across the platform.
                  </p>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                      <Percent className="h-4 w-4 text-primary" />
                      Payment Processing
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="paymentPercent">Percentage fee (%)</Label>
                        <Input
                          id="paymentPercent"
                          type="number"
                          step="0.1"
                          value={fees.paymentPercent}
                          onChange={(e) => setFees({ ...fees, paymentPercent: parseFloat(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paymentFixed">Fixed fee ($)</Label>
                        <Input
                          id="paymentFixed"
                          type="number"
                          step="0.01"
                          value={fees.paymentFixed}
                          onChange={(e) => setFees({ ...fees, paymentFixed: parseFloat(e.target.value) })}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                      <DollarSign className="h-4 w-4 text-chart-4" />
                      Transfers
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="transferPercent">Percentage fee (%)</Label>
                        <Input
                          id="transferPercent"
                          type="number"
                          step="0.1"
                          value={fees.transferPercent}
                          onChange={(e) => setFees({ ...fees, transferPercent: parseFloat(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="transferFixed">Fixed fee ($)</Label>
                        <Input
                          id="transferFixed"
                          type="number"
                          step="0.01"
                          value={fees.transferFixed}
                          onChange={(e) => setFees({ ...fees, transferFixed: parseFloat(e.target.value) })}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                      <DollarSign className="h-4 w-4 text-chart-2" />
                      Withdrawals & Conversions
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="withdrawalPercent">Withdrawal (%)</Label>
                        <Input
                          id="withdrawalPercent"
                          type="number"
                          step="0.1"
                          value={fees.withdrawalPercent}
                          onChange={(e) => setFees({ ...fees, withdrawalPercent: parseFloat(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="withdrawalFixed">Withdrawal fixed ($)</Label>
                        <Input
                          id="withdrawalFixed"
                          type="number"
                          step="0.01"
                          value={fees.withdrawalFixed}
                          onChange={(e) => setFees({ ...fees, withdrawalFixed: parseFloat(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="conversionFee">Conversion (%)</Label>
                        <Input
                          id="conversionFee"
                          type="number"
                          step="0.1"
                          value={fees.currencyConversion}
                          onChange={(e) => setFees({ ...fees, currencyConversion: parseFloat(e.target.value) })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <Button className="mt-6" onClick={handleSave} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save fee structure
                </Button>
              </Card>
            )}

            {activeTab === 'platform' && (
              <Card className="p-6">
                <div className="mb-6">
                  <h3 className="font-display text-lg font-semibold">Platform Configuration</h3>
                  <p className="text-sm text-muted-foreground">Global platform settings and limits.</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="text-sm font-medium">Maintenance mode</p>
                      <p className="text-xs text-muted-foreground">Temporarily disable all user transactions</p>
                    </div>
                    <Switch
                      checked={platform.maintenanceMode}
                      onCheckedChange={(v) => setPlatform({ ...platform, maintenanceMode: v })}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="text-sm font-medium">New registrations</p>
                      <p className="text-xs text-muted-foreground">Allow new users to sign up</p>
                    </div>
                    <Switch
                      checked={platform.newRegistrations}
                      onCheckedChange={(v) => setPlatform({ ...platform, newRegistrations: v })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxTxn">Max transaction amount ($)</Label>
                    <Input
                      id="maxTxn"
                      type="number"
                      value={platform.maxTransactionAmount}
                      onChange={(e) => setPlatform({ ...platform, maxTransactionAmount: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currencies">Supported currencies (comma-separated)</Label>
                    <Input
                      id="currencies"
                      value={platform.supportedCurrencies}
                      onChange={(e) => setPlatform({ ...platform, supportedCurrencies: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kycLevel">Minimum KYC level required</Label>
                    <select
                      id="kycLevel"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={platform.minKycLevel}
                      onChange={(e) => setPlatform({ ...platform, minKycLevel: e.target.value })}
                    >
                      <option value="NONE">None — No KYC required</option>
                      <option value="BASIC">Basic — Email + Phone</option>
                      <option value="FULL">Full — Identity verification</option>
                      <option value="ENHANCED">Enhanced — Full + address proof</option>
                    </select>
                  </div>
                </div>
                <Button className="mt-6" onClick={handleSave} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save platform settings
                </Button>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card className="p-6">
                <div className="mb-6">
                  <h3 className="font-display text-lg font-semibold">Security Policies</h3>
                  <p className="text-sm text-muted-foreground">Platform-wide security configuration.</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="text-sm font-medium">Require 2FA for all users</p>
                      <p className="text-xs text-muted-foreground">Force two-factor authentication</p>
                    </div>
                    <Switch
                      checked={security.twoFactorRequired}
                      onCheckedChange={(v) => setSecurity({ ...security, twoFactorRequired: v })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ipWhitelist">IP whitelist (comma-separated, empty = allow all)</Label>
                    <Input
                      id="ipWhitelist"
                      placeholder="192.168.1.1, 10.0.0.0/24"
                      value={security.ipWhitelist}
                      onChange={(e) => setSecurity({ ...security, ipWhitelist: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rateLimit">Rate limit (requests/min)</Label>
                      <Input
                        id="rateLimit"
                        type="number"
                        value={security.rateLimitPerMin}
                        onChange={(e) => setSecurity({ ...security, rateLimitPerMin: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="autoSuspend">Auto-suspend after N failed logins</Label>
                      <Input
                        id="autoSuspend"
                        type="number"
                        value={security.autoSuspendFailedLogins}
                        onChange={(e) => setSecurity({ ...security, autoSuspendFailedLogins: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                    <Lock className="h-4 w-4 text-success" />
                    <span className="text-sm text-muted-foreground">
                      Encryption: <span className="font-medium text-foreground">{security.encryptionLevel}</span>
                    </span>
                  </div>
                </div>
                <Button className="mt-6" onClick={handleSave} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save security settings
                </Button>
              </Card>
            )}

            {activeTab === 'services' && (
              <Card className="p-6">
                <div className="mb-6">
                  <h3 className="font-display text-lg font-semibold">Service Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable microservices. Disabled services return 503.
                  </p>
                </div>
                <div className="space-y-3">
                  {Object.entries(services).map(([name, enabled]) => (
                    <div key={name} className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'flex h-9 w-9 items-center justify-center rounded-lg',
                          enabled ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                        )}>
                          <Server className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium font-mono">{name}-service</p>
                          <p className="text-xs text-muted-foreground">
                            {enabled ? 'Running' : 'Disabled'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={enabled ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}>
                          {enabled ? 'ENABLED' : 'DISABLED'}
                        </Badge>
                        <Switch
                          checked={enabled}
                          onCheckedChange={(v) => setServices({ ...services, [name]: v })}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="mt-6" onClick={handleSave} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Apply service changes
                </Button>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card className="p-6">
                <div className="mb-6">
                  <h3 className="font-display text-lg font-semibold">Admin Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure alerts sent to administrators.
                  </p>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Large transaction alerts', desc: 'Notify on transactions > $50,000', defaultChecked: true },
                    { label: 'Failed payment spikes', desc: 'Alert when failure rate > 5%', defaultChecked: true },
                    { label: 'New user registrations', desc: 'Daily summary of new signups', defaultChecked: false },
                    { label: 'KYC submission alerts', desc: 'Notify when KYC is submitted', defaultChecked: true },
                    { label: 'Service downtime', desc: 'Immediate alert on service failure', defaultChecked: true },
                    { label: 'Suspicious activity', desc: 'Alert on flagged transactions', defaultChecked: true },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch defaultChecked={item.defaultChecked} />
                    </div>
                  ))}
                </div>
                <Button className="mt-6" onClick={handleSave} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save notification preferences
                </Button>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
