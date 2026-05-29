'use client';

import { Calendar, Clock, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScheduledPaymentModal } from '@/components/dashboard/ScheduledPaymentModal';

type ScheduledPayment = {
  id: string;
  recipient: { name: string; address: string };
  amount: number;
  scheduledDate: string;
  scheduledTime: string;
  recurring?: 'weekly' | 'monthly' | null;
};

export default function ScheduledPaymentsPage() {
  const [payments, setPayments] = useState<ScheduledPayment[]>([
    {
      id: '1',
      recipient: { name: 'Alice Johnson', address: 'GBRPYHIL2CI3WHZDTOOQFC6EB4KJJGUJMJ7NZJY77ZJ7GZ5BVEOQBEY' },
      amount: 1000,
      scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      scheduledTime: '14:30',
      recurring: null,
    },
    {
      id: '2',
      recipient: { name: 'Bob Smith', address: 'GBBD47UZQ2YPJYAUQQ5NGYMYV2CC7N4RFCZSTF3FVXPJ7BEUCNF3XAC' },
      amount: 500,
      scheduledDate: new Date(Date.now() + 604800000).toISOString().split('T')[0],
      scheduledTime: '09:00',
      recurring: 'weekly',
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);

  const handleAddPayment = (payment: ScheduledPayment) => {
    setPayments([...payments, payment]);
  };

  const handleDeletePayment = (id: string) => {
    setPayments(payments.filter((p) => p.id !== id));
  };

  const getRecurringLabel = (recurring?: string | null) => {
    switch (recurring) {
      case 'weekly':
        return 'Weekly';
      case 'monthly':
        return 'Monthly';
      default:
        return 'One-off';
    }
  };

  return (
    <>
      {modalOpen && <ScheduledPaymentModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleAddPayment} />}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink">Scheduled Payments</h1>
            <p className="text-sm text-slate-500">Manage one-off and recurring outgoing payments to your recipients.</p>
          </div>
          <Button onClick={() => setModalOpen(true)}>
            <Plus size={16} /> Schedule Payment
          </Button>
        </div>

        {payments.length === 0 ? (
          <Card className="flex items-center justify-between">
            <div>
              <div className="font-medium text-ink">No scheduled payments</div>
              <div className="text-sm text-slate-500">Schedule your first payment to get started.</div>
            </div>
            <Button onClick={() => setModalOpen(true)}>Schedule Payment</Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {payments.map((payment) => (
              <Card key={payment.id} className="flex items-center justify-between p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium text-ink">{payment.recipient.name}</div>
                      <div className="font-mono text-xs text-slate-500">{payment.recipient.address.slice(0, 30)}...</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div className="font-semibold text-ink">{payment.amount.toFixed(2)} USDC</div>
                    <Badge status="pending" />
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      {new Date(payment.scheduledDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      {payment.scheduledTime}
                    </div>
                    <div className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                      {getRecurringLabel(payment.recurring)}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeletePayment(payment.id)}
                    className="text-slate-400 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
