'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import type { BrandingSettings as BrandingSettingsType } from '@/types';

const DEFAULT_BRANDING: BrandingSettingsType = {
  primary_color: '#6C5CE7',
  secondary_color: '#00CEC9',
  accent_color: '#1860A5',
  cta_text: 'Pay with USDC',
  cta_background_color: '#0D0F1A',
  cta_text_color: '#FFFFFF',
  show_merchant_name: true,
};

export function BrandingSettings() {
  const [settings, setSettings] = useState<BrandingSettingsType>(DEFAULT_BRANDING);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.branding.get().then((data) => {
      setSettings(data);
      if (data.logo_url) setLogoPreview(data.logo_url);
    }).catch(() => {
      // Use defaults if API fails
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview locally
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    // Upload to server
    try {
      const formData = new FormData();
      formData.append('logo', file);
      await api.branding.uploadLogo(formData);
      setSaveMessage({ type: 'success', text: 'Logo uploaded successfully.' });
    } catch (err) {
      console.error('Logo upload failed:', err);
      setSaveMessage({ type: 'error', text: 'Failed to upload logo.' });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      await api.branding.update(settings);
      setSaveMessage({ type: 'success', text: 'Branding settings saved successfully.' });
    } catch (err) {
      console.error('Failed to save branding:', err);
      setSaveMessage({ type: 'error', text: 'Failed to save branding settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(DEFAULT_BRANDING);
    setLogoPreview(null);
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">Loading branding settings...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 space-y-6">
      <div>
        <h3 className="font-semibold text-ink mb-1">Payment Page Branding</h3>
        <p className="text-sm text-slate-600">
          Customise the look and feel of your public payment pages. Changes apply instantly.
        </p>
      </div>

      {saveMessage && (
        <div
          className={`rounded-md p-3 text-sm ${
            saveMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {saveMessage.text}
        </div>
      )}

      {/* Logo upload */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-ink">Logo</label>
        <div className="flex items-center gap-4">
          {logoPreview ? (
            <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-slate-200 bg-white">
              <img src={logoPreview} alt="Brand logo" className="h-full w-full object-contain" />
            </div>
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400">
              No logo
            </div>
          )}
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-ink ring-1 ring-slate-300 hover:bg-slate-50"
            >
              {logoPreview ? 'Change' : 'Upload'}
            </Button>
            {logoPreview && (
              <Button
                type="button"
                onClick={() => { setLogoPreview(null); }}
                className="bg-white text-red-600 ring-1 ring-slate-300 hover:bg-red-50"
              >
                Remove
              </Button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            className="hidden"
            onChange={handleLogoUpload}
          />
        </div>
        <p className="text-xs text-slate-400">Recommended: PNG or SVG, at least 256x256px. Max 2MB.</p>
      </div>

      {/* Brand colours */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink">Primary Colour</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={settings.primary_color}
              onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
              className="h-10 w-10 cursor-pointer rounded-md border border-slate-300"
            />
            <Input
              value={settings.primary_color}
              onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
              className="font-mono text-xs"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-ink">Secondary Colour</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={settings.secondary_color}
              onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
              className="h-10 w-10 cursor-pointer rounded-md border border-slate-300"
            />
            <Input
              value={settings.secondary_color}
              onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
              className="font-mono text-xs"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-ink">Accent Colour</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={settings.accent_color}
              onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
              className="h-10 w-10 cursor-pointer rounded-md border border-slate-300"
            />
            <Input
              value={settings.accent_color}
              onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
              className="font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* CTA button customisation */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-ink">Call-to-Action Button</label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Button Text</label>
            <Input
              value={settings.cta_text}
              onChange={(e) => setSettings({ ...settings, cta_text: e.target.value })}
              placeholder="Pay with USDC"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Background Colour</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={settings.cta_background_color}
                onChange={(e) => setSettings({ ...settings, cta_background_color: e.target.value })}
                className="h-10 w-10 cursor-pointer rounded-md border border-slate-300"
              />
              <Input
                value={settings.cta_background_color}
                onChange={(e) => setSettings({ ...settings, cta_background_color: e.target.value })}
                className="font-mono text-xs flex-1"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Text Colour</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={settings.cta_text_color}
                onChange={(e) => setSettings({ ...settings, cta_text_color: e.target.value })}
                className="h-10 w-10 cursor-pointer rounded-md border border-slate-300"
              />
              <Input
                value={settings.cta_text_color}
                onChange={(e) => setSettings({ ...settings, cta_text_color: e.target.value })}
                className="font-mono text-xs flex-1"
              />
            </div>
          </div>
        </div>
        {/* Preview */}
        <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-4">
          <p className="mb-2 text-xs font-medium text-slate-500">Preview</p>
          <button
            className="h-10 rounded-md px-6 text-sm font-medium transition-colors"
            style={{
              backgroundColor: settings.cta_background_color,
              color: settings.cta_text_color,
            }}
          >
            {settings.cta_text || 'Pay with USDC'}
          </button>
        </div>
      </div>

      {/* Show merchant name toggle */}
      <div className="flex items-center justify-between rounded-md border border-slate-200 p-3">
        <div>
          <p className="text-sm font-medium text-ink">Show merchant name</p>
          <p className="text-xs text-slate-500">Display your business name on the payment page.</p>
        </div>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={settings.show_merchant_name}
            onChange={(e) => setSettings({ ...settings, show_merchant_name: e.target.checked })}
            className="peer sr-only"
          />
          <div className="h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-violet peer-checked:after:translate-x-full" />
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Branding'}
        </Button>
        <Button
          onClick={handleReset}
          className="bg-white text-ink ring-1 ring-slate-300 hover:bg-slate-50"
        >
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
