'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { api } from '@/lib/api';

export default function ApiKeysPage() {
  const { data, mutate } = useSWR('api-keys', () => api.apiKeys.list());
  const [showCreate, setShowCreate] = useState(false);
  const [showKey, setShowKey] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  async function handleCreate(formData: FormData) {
    const name = formData.get('name') as string;
    const scopes = (formData.get('scopes') as string).split(',').map(s => s.trim());
    const result = await api.apiKeys.create({ name, scopes });
    setShowKey(result.key);
    mutate();
    setShowCreate(false);
  }

  async function handleRename(id: string) {
    await api.apiKeys.update(id, { name: newName });
    setRenaming(null);
    mutate();
  }

  async function handleRevoke(id: string) {
    if (confirm('Revoke this API key? This cannot be undone.')) {
      await api.apiKeys.revoke(id);
      mutate();
    }
  }

  const keys = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">API Keys</h1>
          <p className="text-sm text-slate-500">Create and manage API keys for programmatic access.</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>Create key</Button>
      </div>

      <div className="rounded-md border border-slate-200 bg-white">
        {keys.length > 0 ? (
          keys.map((key: any) => (
            <div key={key.id} className="flex items-center justify-between border-b border-slate-100 p-4 text-sm">
              <div className="flex-1">
                <div className="font-medium text-ink">{key.name}</div>
                <div className="mt-1 text-xs text-slate-500">
                  {key.scopes?.join(', ')} · Created {new Date(key.created_at).toLocaleDateString()}
                  {key.last_used_at && ` · Last used ${new Date(key.last_used_at).toLocaleDateString()}`}
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="bg-white text-ink ring-1 ring-slate-300" onClick={() => setRenaming(key.id)}>Rename</Button>
                <Button className="bg-red-700" onClick={() => handleRevoke(key.id)}>Revoke</Button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-sm text-slate-500">No API keys yet.</div>
        )}
      </div>

      {showCreate && (
        <Modal onClose={() => setShowCreate(false)}>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-ink">Create API Key</h2>
            <form action={handleCreate} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-ink">Name</label>
                <Input name="name" placeholder="e.g., Production API" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink">Scopes (comma-separated)</label>
                <Input name="scopes" placeholder="e.g., invoices:read, invoices:write" required />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Create</Button>
                <Button type="button" className="bg-white text-ink ring-1 ring-slate-300" onClick={() => setShowCreate(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {showKey && (
        <Modal onClose={() => setShowKey(null)}>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-ink">API Key Created</h2>
            <p className="text-sm text-slate-600">Save this key somewhere safe. You won't be able to see it again.</p>
            <div className="rounded-md bg-slate-100 p-3">
              <code className="break-all font-mono text-xs text-slate-900">{showKey}</code>
            </div>
            <Button onClick={() => { navigator.clipboard.writeText(showKey); setShowKey(null); }}>Copy and close</Button>
          </div>
        </Modal>
      )}

      {renaming && (
        <Modal onClose={() => setRenaming(null)}>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-ink">Rename API Key</h2>
            <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New name" />
            <div className="flex gap-2">
              <Button onClick={() => handleRename(renaming)}>Rename</Button>
              <Button className="bg-white text-ink ring-1 ring-slate-300" onClick={() => setRenaming(null)}>Cancel</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
