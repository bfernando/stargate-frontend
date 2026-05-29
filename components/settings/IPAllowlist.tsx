'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type IPAllowlistEntry = {
  id: string;
  cidr: string;
  description?: string;
};

type IPAllowlistProps = {
  apiKeyId: string;
  entries: IPAllowlistEntry[];
  onAdd: (cidr: string, description?: string) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
};

export function IPAllowlist({ apiKeyId, entries, onAdd, onRemove }: IPAllowlistProps) {
  const [cidr, setCidr] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!cidr.trim()) return;
    setLoading(true);
    try {
      await onAdd(cidr, description || undefined);
      setCidr('');
      setDescription('');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    setRemoving(id);
    try {
      await onRemove(id);
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">CIDR Range</label>
          <Input
            placeholder="192.168.1.0/24 or 10.0.0.1/32"
            value={cidr}
            onChange={(e) => setCidr(e.currentTarget.value)}
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description (optional)</label>
          <Input
            placeholder="e.g., Office network"
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
            disabled={loading}
          />
        </div>
        <Button onClick={handleAdd} disabled={loading || !cidr.trim()}>
          {loading ? 'Adding...' : 'Add IP Range'}
        </Button>
      </div>

      {entries.length > 0 && (
        <div className="border-t border-slate-200 pt-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Allowed IP Ranges</h3>
          <div className="space-y-2">
            {entries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-3">
                <div>
                  <p className="font-mono text-sm text-slate-900">{entry.cidr}</p>
                  {entry.description && <p className="text-xs text-slate-500">{entry.description}</p>}
                </div>
                <button
                  onClick={() => handleRemove(entry.id)}
                  disabled={removing === entry.id}
                  className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  {removing === entry.id ? 'Removing...' : 'Remove'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
