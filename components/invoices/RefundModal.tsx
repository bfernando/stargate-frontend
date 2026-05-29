'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

type RefundModalProps = {
  open: boolean;
  onClose: () => void;
  invoiceId: string;
  amount: string;
  onConfirm: () => Promise<void>;
};

export function RefundModal({ open, onClose, invoiceId, amount, onConfirm }: RefundModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Refund failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Confirm Refund">
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Are you sure you want to refund <strong>{amount} USDC</strong> for invoice <code className="rounded bg-slate-100 px-1">{invoiceId}</code>?
        </p>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={loading}>
            {loading ? 'Processing...' : 'Confirm Refund'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
