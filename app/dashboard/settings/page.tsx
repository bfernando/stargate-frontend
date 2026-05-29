'use client';

import { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CopyField } from '@/components/ui/CopyField';
import { Input } from '@/components/ui/Input';
import { TwoFactorManagement } from '@/components/auth/TwoFactorManagement';
import { TOTPSetupGuide } from '@/components/auth/TOTPSetupGuide';
import { CustomDomainConfig } from '@/components/settings/CustomDomainConfig';
import { StellarAddressQR } from '@/components/settings/StellarAddressQR';
import { BrandingSettings } from '@/components/settings/BrandingSettings';
import { api } from '@/lib/api';
import { IPAllowlist } from '@/components/settings/IPAllowlist';
import { api } from '@/lib/api';
import { useState, useEffect } from 'react';
import useSWR from 'swr';

export default function SettingsPage() {
  const [showTOTPSetup, setShowTOTPSetup] = useState(false);
  const [stellarAddress, setStellarAddress] = useState('');
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [selectedApiKey, setSelectedApiKey] = useState<string | null>(null);
  const { data: apiKeys } = useSWR('api-keys', () => api.apiKeys.list());
  const { data: allowlist, mutate: mutateAllowlist } = useSWR(
    selectedApiKey ? ['ip-allowlist', selectedApiKey] : null,
    () => selectedApiKey ? api.apiKeys.ipAllowlist.list(selectedApiKey) : Promise.resolve([])
  );

  useEffect(() => {
    if (apiKeys?.length && !selectedApiKey) {
      setSelectedApiKey(apiKeys[0].id);
    }
  }, [apiKeys, selectedApiKey]);

  async function save(formData: FormData) {
    await api.merchants.update({
      name: formData.get('name'),
      stellar_address: formData.get('stellar_address'),
      settlement_cadence: formData.get('settlement_cadence'),
      checkout_domain: formData.get('checkout_domain'),
    });
    setStellarAddress(formData.get('stellar_address') as string);
  }

  async function generateApiKey() {
    const result = await (api as any).developers?.generateKey?.() ?? null;
    if (result?.key) setApiKey(result.key);
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink">Settings</h1>
        <Link
          href="/dashboard/settings/audit-log"
          className="inline-flex h-9 items-center gap-2 rounded-md bg-white px-3 text-sm font-medium text-ink ring-1 ring-slate-300 hover:bg-slate-50"
        >
          <ClipboardList size={16} /> Audit Log
        </Link>
      </div>

      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-ink mb-4">Merchant Settings</h2>
          <form action={save} className="space-y-3">
            <Input name="name" placeholder="Merchant name" />
            <Input name="stellar_address" placeholder="G... settlement address" />
            <select name="settlement_cadence" className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
            <Input name="checkout_domain" placeholder="example.com (optional custom checkout domain)" />
            <Button>Save settings</Button>
          </form>

          {stellarAddress && (
            <div className="mt-6 space-y-3">
              <h3 className="text-sm font-semibold text-ink">Stellar Receiving Address QR</h3>
              <CopyField value={stellarAddress} label="Stellar address" />
              <StellarAddressQR address={stellarAddress} label="Scan to send USDC to this address" />
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-ink mb-4">API Key</h2>
          {apiKey ? (
            <div className="space-y-2">
              <p className="text-xs text-slate-500">
                Copy your key now — it will not be shown again.
              </p>
              <CopyField value={apiKey} label="Secret key" masked />
            </div>
          ) : (
            <Button onClick={generateApiKey}>Generate API key</Button>
          )}
        </div>

        {apiKeys && apiKeys.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-ink mb-4">IP Allowlist</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Select API Key</label>
              <select
                value={selectedApiKey || ''}
                onChange={(e) => setSelectedApiKey(e.target.value)}
                className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm w-full"
              >
                {apiKeys.map((key: any) => (
                  <option key={key.id} value={key.id}>
                    {key.name || key.id}
                  </option>
                ))}
              </select>
            </div>
            {selectedApiKey && (
              <IPAllowlist
                apiKeyId={selectedApiKey}
                entries={allowlist || []}
                onAdd={(cidr, description) =>
                  api.apiKeys.ipAllowlist.add(selectedApiKey, cidr, description).then(() => mutateAllowlist())
                }
                onRemove={(id) =>
                  api.apiKeys.ipAllowlist.remove(selectedApiKey, id).then(() => mutateAllowlist())
                }
              />
            )}
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold text-ink mb-4">Checkout Domain</h2>
          <CustomDomainConfig />
        </div>

        {/* Payment Page Branding */}
        <div className="border-t border-slate-200 pt-6">
          <h2 className="text-lg font-semibold text-ink mb-4">Payment Page Branding</h2>
          <BrandingSettings />
        </div>

        <div className="border-t border-slate-200 pt-6">
          <h2 className="text-lg font-semibold text-ink mb-4">Security</h2>
          {!showTOTPSetup ? (
            <div className="space-y-4">
              <TwoFactorManagement />
              <Button onClick={() => setShowTOTPSetup(true)} className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                Set Up Two-Factor Authentication
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <TOTPSetupGuide />
              <Button
                onClick={() => setShowTOTPSetup(false)}
                className="bg-slate-200 text-slate-700 hover:bg-slate-300"
              >
                Back to Settings
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
