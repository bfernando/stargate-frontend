'use client';

import { Eye, EyeOff, Lock } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

type PasswordProtectionModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (password: string | null) => void;
  currentPassword?: string | null;
};

export function PasswordProtectionModal({ open, onClose, onSave, currentPassword }: PasswordProtectionModalProps) {
  const [enabled, setEnabled] = useState(!!currentPassword);
  const [password, setPassword] = useState(currentPassword || '');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSave = () => {
    if (enabled && !password) {
      setError('Password is required');
      return;
    }
    if (enabled && password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }
    onSave(enabled ? password : null);
    onClose();
  };

  const handleClose = () => {
    setPassword(currentPassword || '');
    setEnabled(!!currentPassword);
    setError('');
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Password Protection" description="Protect this payment link with a passcode">
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => {
              setEnabled(e.target.checked);
              setError('');
            }}
            className="h-4 w-4 rounded border-slate-300"
          />
          <label className="flex-1 text-sm font-medium text-ink">Require passcode to view checkout</label>
          <Lock size={16} className="text-slate-400" />
        </div>

        {enabled && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-ink">Passcode</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter a secure passcode"
                className="w-full rounded-md border border-slate-300 px-3 py-2 pr-10 text-sm focus:border-violet focus:outline-none focus:ring-1 focus:ring-violet"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <div className="text-xs text-slate-500">
              Payers will need to enter this passcode before accessing the checkout page.
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button className="flex-1 bg-white text-ink ring-1 ring-slate-300 hover:bg-slate-50" onClick={handleClose}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}
