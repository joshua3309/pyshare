'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  ShieldX,
  FileText,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  MapPin,
  Calendar,
  IdCard,
  User,
  Mail,
  Phone,
  X,
  Eye,
} from 'lucide-react';
import { Button } from '@workspace/ui';
import { Card } from '@workspace/ui';
import { Badge } from '@workspace/ui';
import { useToast } from '@workspace/ui';
import { cn } from '@workspace/ui';

interface KycSubmission {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  documentType: string;
  documentNumber: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  submittedAt: string;
  status: 'IN_REVIEW' | 'APPROVED' | 'REJECTED';
  avatar: string;
  riskScore: number;
}

const mockSubmissions: KycSubmission[] = [
  {
    id: 'KYC-001', userId: 'USR-005', name: 'Aisha Patel', email: 'aisha@retail.io',
    phone: '+1 (555) 234-5678', dateOfBirth: '1988-03-15', documentType: 'Passport',
    documentNumber: 'P12345678', address: '450 Mission St, Suite 300', city: 'San Francisco',
    state: 'CA', zip: '94105', country: 'United States', submittedAt: '2024-01-15 10:30',
    status: 'IN_REVIEW', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
    riskScore: 12,
  },
  {
    id: 'KYC-002', userId: 'USR-006', name: 'Thomas Mueller', email: 'thomas@worldgoods.com',
    phone: '+49 30 12345678', dateOfBirth: '1990-07-22', documentType: 'National ID',
    documentNumber: 'DE1234567', address: 'Friedrichstrasse 100', city: 'Berlin',
    state: 'BE', zip: '10117', country: 'Germany', submittedAt: '2024-01-15 09:15',
    status: 'IN_REVIEW', avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150',
    riskScore: 8,
  },
  {
    id: 'KYC-003', userId: 'USR-007', name: 'John Smith', email: 'john@acme.com',
    phone: '+1 (555) 987-6543', dateOfBirth: '1995-11-30', documentType: 'Driver License',
    documentNumber: 'DL78901234', address: '123 Main Street, Apt 4B', city: 'New York',
    state: 'NY', zip: '10001', country: 'United States', submittedAt: '2024-01-14 16:45',
    status: 'IN_REVIEW', avatar: 'https://images.pexels.com/photos/1221516/pexels-photo-1221516.jpeg?auto=compress&cs=tinysrgb&w=150',
    riskScore: 25,
  },
  {
    id: 'KYC-004', userId: 'USR-009', name: 'Robert Chang', email: 'robert@innovate.com',
    phone: '+1 (555) 456-7890', dateOfBirth: '1982-05-18', documentType: 'Passport',
    documentNumber: 'P98765432', address: '789 Tech Boulevard', city: 'Austin',
    state: 'TX', zip: '78701', country: 'United States', submittedAt: '2024-01-14 14:20',
    status: 'IN_REVIEW', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
    riskScore: 45,
  },
];

export default function AdminKycPage() {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState(mockSubmissions);
  const [selected, setSelected] = useState<KycSubmission | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmissions(submissions.map((s) => (s.id === id ? { ...s, status: 'APPROVED' as const } : s)));
    setActionLoading(null);
    setSelected(null);
    toast({ title: 'KYC approved', description: `Verification ${id} has been approved.` });
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmissions(submissions.map((s) => (s.id === id ? { ...s, status: 'REJECTED' as const } : s)));
    setActionLoading(null);
    setSelected(null);
    toast({ title: 'KYC rejected', description: `Verification ${id} has been rejected.`, variant: 'destructive' });
  };

  const pending = submissions.filter((s) => s.status === 'IN_REVIEW');
  const approved = submissions.filter((s) => s.status === 'APPROVED');
  const rejected = submissions.filter((s) => s.status === 'REJECTED');

  const getRiskColor = (score: number) => {
    if (score < 20) return 'text-success';
    if (score < 35) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">KYC Review</h1>
        <p className="text-sm text-muted-foreground">
          Review and approve identity verification submissions.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Pending review', value: pending.length, icon: Clock, color: 'text-warning' },
          { label: 'Approved', value: approved.length, icon: CheckCircle2, color: 'text-success' },
          { label: 'Rejected', value: rejected.length, icon: XCircle, color: 'text-destructive' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 font-display text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={cn('h-6 w-6', stat.color)} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pending submissions */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-semibold">Pending Review</h2>
        {pending.length === 0 ? (
          <Card className="p-12 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
            <p className="mt-4 font-medium">All caught up!</p>
            <p className="text-sm text-muted-foreground">No pending KYC submissions.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {pending.map((submission, i) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="overflow-hidden">
                  <div className="flex items-start gap-4 p-5">
                    <img
                      src={submission.avatar}
                      alt={submission.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{submission.name}</p>
                          <p className="text-xs text-muted-foreground">{submission.email}</p>
                        </div>
                        <div className="text-right">
                          <p className={cn('text-xs font-medium', getRiskColor(submission.riskScore))}>
                            Risk: {submission.riskScore}/100
                          </p>
                          <p className="text-xs text-muted-foreground">{submission.id}</p>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <IdCard className="h-3.5 w-3.5" />
                          {submission.documentType}
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          {submission.country}
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {submission.submittedAt}
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <FileText className="h-3.5 w-3.5" />
                          {submission.documentNumber}
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => setSelected(submission)}
                        >
                          <Eye className="mr-1.5 h-3.5 w-3.5" />
                          Review
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-success text-success-foreground hover:bg-success/90"
                          onClick={() => handleApprove(submission.id)}
                          disabled={actionLoading === submission.id}
                        >
                          {actionLoading === submission.id ? (
                            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                          )}
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1"
                          onClick={() => handleReject(submission.id)}
                          disabled={actionLoading === submission.id}
                        >
                          <XCircle className="mr-1.5 h-3.5 w-3.5" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Review modal */}
      <AnimatePresence>
        {selected && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl"
            >
              <Card className="max-h-[90vh] overflow-y-auto p-0">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/95 p-5 backdrop-blur">
                  <div className="flex items-center gap-3">
                    <img src={selected.avatar} alt={selected.name} className="h-10 w-10 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold">{selected.name}</p>
                      <p className="text-xs text-muted-foreground">{selected.id} · {selected.userId}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelected(null)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Body */}
                <div className="space-y-6 p-6">
                  {/* Risk assessment */}
                  <div className={cn(
                    'flex items-center justify-between rounded-xl border p-4',
                    selected.riskScore < 20 ? 'border-success/30 bg-success/5' :
                    selected.riskScore < 35 ? 'border-warning/30 bg-warning/5' :
                    'border-destructive/30 bg-destructive/5'
                  )}>
                    <div>
                      <p className="text-sm font-medium">Risk Assessment</p>
                      <p className="text-xs text-muted-foreground">Automated risk score</p>
                    </div>
                    <div className="text-right">
                      <p className={cn('font-display text-2xl font-bold', getRiskColor(selected.riskScore))}>
                        {selected.riskScore}/100
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selected.riskScore < 20 ? 'Low risk' : selected.riskScore < 35 ? 'Medium risk' : 'High risk'}
                      </p>
                    </div>
                  </div>

                  {/* Personal info */}
                  <div>
                    <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { icon: User, label: 'Full name', value: selected.name },
                        { icon: Mail, label: 'Email', value: selected.email },
                        { icon: Phone, label: 'Phone', value: selected.phone },
                        { icon: Calendar, label: 'Date of birth', value: selected.dateOfBirth },
                      ].map((item) => (
                        <div key={item.label} className="rounded-lg border border-border p-3">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <item.icon className="h-3.5 w-3.5" />
                            {item.label}
                          </div>
                          <p className="mt-1 text-sm font-medium">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Document info */}
                  <div>
                    <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Document
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { icon: IdCard, label: 'Type', value: selected.documentType },
                        { icon: FileText, label: 'Number', value: selected.documentNumber },
                      ].map((item) => (
                        <div key={item.label} className="rounded-lg border border-border p-3">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <item.icon className="h-3.5 w-3.5" />
                            {item.label}
                          </div>
                          <p className="mt-1 text-sm font-medium">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Address
                    </h3>
                    <div className="rounded-lg border border-border p-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        Address
                      </div>
                      <p className="mt-1 text-sm font-medium">{selected.address}</p>
                      <p className="text-sm text-muted-foreground">
                        {selected.city}, {selected.state} {selected.zip}
                      </p>
                      <p className="text-sm text-muted-foreground">{selected.country}</p>
                    </div>
                  </div>

                  {/* Document preview placeholder */}
                  <div>
                    <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Document Images
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {['Front', 'Back'].map((side) => (
                        <div key={side} className="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30">
                          <div className="text-center">
                            <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
                            <p className="mt-2 text-xs text-muted-foreground">{side} of {selected.documentType}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 border-t border-border pt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setSelected(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleReject(selected.id)}
                      disabled={actionLoading === selected.id}
                    >
                      <ShieldX className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      className="flex-1 bg-success text-success-foreground hover:bg-success/90"
                      onClick={() => handleApprove(selected.id)}
                      disabled={actionLoading === selected.id}
                    >
                      {actionLoading === selected.id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <ShieldCheck className="mr-2 h-4 w-4" />
                      )}
                      Approve
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Processed submissions */}
      {(approved.length > 0 || rejected.length > 0) && (
        <div className="space-y-4">
          <h2 className="font-display text-lg font-semibold">Recently Processed</h2>
          <div className="space-y-2">
            {[...approved, ...rejected].map((submission, i) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <img src={submission.avatar} alt={submission.name} className="h-9 w-9 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-medium">{submission.name}</p>
                      <p className="text-xs text-muted-foreground">{submission.id} · {submission.submittedAt}</p>
                    </div>
                  </div>
                  <Badge className={submission.status === 'APPROVED' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}>
                    {submission.status === 'APPROVED' ? (
                      <><CheckCircle2 className="mr-1 h-3 w-3" /> Approved</>
                    ) : (
                      <><XCircle className="mr-1 h-3 w-3" /> Rejected</>
                    )}
                  </Badge>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
