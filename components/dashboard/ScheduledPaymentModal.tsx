'use client';

import { Calendar, Clock, Plus, Trash2, User } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

type Recipient = {
  id: string;
  name: string;
  address: string;
};

type ScheduledPayment = {
  id: string;
  recipient: Recipient;
  amount: number;
  scheduledDate: string;
  scheduledTime: string;
  recurring?: 'weekly' | 'monthly' | null;
};

type ScheduledPaymentModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (payment: ScheduledPayment) => void;
};

export function ScheduledPaymentModal({ open, onClose, onSave }: ScheduledPaymentModalProps) {
  const [recipients, setRecipients] = useState<Recipient[]>([
    { id: '1', name: 'Alice Johnson', address: 'GBRPYHIL2CI3WHZDTOOQFC6EB4KJJGUJMJ7NZJY77ZJ7GZ5BVEOQBEY' },
    { id: '2', name: 'Bob Smith', address: 'GBBD47UZQ2YPJYAUQQ5NGYMYV2CC7N4RFCZSTF3FVXPJ7BEUCNF3XAC' },
  ]);

  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('12:00');
  const [recurring, setRecurring] = useState<'weekly' | 'monthly' | null>(null);
  const [showNewRecipient, setShowNewRecipient] = useState(false);
  const [newRecipientName, setNewRecipientName] = useState('');
  const [newRecipientAddress, setNewRecipientAddress] = useState('');
  const [error, setError] = useState('');

  const handleAddRecipient = () => {
    if (!newRecipientName || !newRecipientAddress) {
      setError('Name and address are required');
      return;
    }
    const newRecipient: Recipient = {
      id: Date.now().toString(),
      name: newRecipientName,
      address: newRecipientAddress,
    };
    setRecipients([...recipients, newRecipient]);
    setSelectedRecipient(newRecipient);
    setNewRecipientName('');
    setNewRecipientAddress('');
    setShowNewRecipient(false);
    setError('');
  };

  const handleSave = () => {
    if (!selectedRecipient || !amount || !date) {
      setError('Please fill in all required fields');
      return;
    }
    if (parseFloat(amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    const payment: ScheduledPayment = {
      id: Date.now().toString(),
      recipient: selectedRecipient,
      amount: parseFloat(amount),
      scheduledDate: date,
      scheduledTime: time,
      recurring,
    };

    onSave(payment);
    handleClose();
  };

  const handleClose = () => {
    setSelectedRecipient(null);
    setAmount('');
    setDate('');
    setTime('12:00');
    setRecurring(null);
    setError('');
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Schedule Payment" description="Schedule a one-off or recurring outgoing payment">
      <div className="space-y-4">
        {/* Recipient Selection */}
        <div>
          <label className="block text-sm font-medium text-ink">Recipient</label>
          <div className="mt-2 space-y-2">
            {recipients.map((recipient) => (
              <button
                key={recipient.id}
                onClick={() => setSelectedRecipient(recipient)}
                className={`w-full rounded-lg border-2 p-3 text-left transition ${
                  selectedRecipient?.id === recipient.id
                    ? 'border-violet bg-violet/5'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <User size={16} className="text-slate-400" />
                  <div>
                    <div className="font-medium text-ink">{recipient.name}</div>
                    <div className="font-mono text-xs text-slate-500">{recipient.address.slice(0, 20)}...</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowNewRecipient(!showNewRecipient)}
            className="mt-2 flex items-center gap-2 text-sm text-violet hover:underline"
          >
            <Plus size={16} /> Add new recipient
          </button>

          {showNewRecipient && (
            <div className="mt-3 space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <input
                type="text"
                placeholder="Recipient name"
                value={newRecipientName}
                onChange={(e) => setNewRecipientName(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-violet focus:outline-none focus:ring-1 focus:ring-violet"
              />
              <input
                type="text"
                placeholder="Stellar address"
                value={newRecipientAddress}
                onChange={(e) => setNewRecipientAddress(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-violet focus:outline-none focus:ring-1 focus:ring-violet"
              />
              <div className="flex gap-2">
                <Button className="flex-1 bg-white text-ink ring-1 ring-slate-300 hover:bg-slate-50" onClick={() => setShowNewRecipient(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleAddRecipient}>
                  Add
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-ink">Amount (USDC)</label>
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-violet focus:outline-none focus:ring-1 focus:ring-violet"
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-ink">Date</label>
            <div className="relative mt-1">
              <Calendar size={16} className="pointer-events-none absolute left-3 top-2.5 text-slate-400" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-md border border-slate-300 pl-9 py-2 text-sm focus:border-violet focus:outline-none focus:ring-1 focus:ring-violet"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink">Time</label>
            <div className="relative mt-1">
              <Clock size={16} className="pointer-events-none absolute left-3 top-2.5 text-slate-400" />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-md border border-slate-300 pl-9 py-2 text-sm focus:border-violet focus:outline-none focus:ring-1 focus:ring-violet"
              />
            </div>
          </div>
        </div>

        {/* Recurring */}
        <div>
          <label className="block text-sm font-medium text-ink">Recurring</label>
          <div className="mt-2 flex gap-2">
            {[
              { value: null, label: 'One-off' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setRecurring(option.value as any)}
                className={`flex-1 rounded-md border-2 py-2 text-sm font-medium transition ${
                  recurring === option.value
                    ? 'border-violet bg-violet/10 text-violet'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <div className="flex gap-2 pt-4">
          <Button className="flex-1 bg-white text-ink ring-1 ring-slate-300 hover:bg-slate-50" onClick={handleClose}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleSave}>
            Schedule Payment
          </Button>
        </div>
      </div>
    </Modal>
  );
}
