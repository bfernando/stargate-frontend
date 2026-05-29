'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { BrandingSettings } from '@/types';

interface Variant {
  name: string;
  traffic_percentage: number;
  branding: BrandingSettings;
}

interface ABTestVariantSelectorProps {
  variants: Variant[];
  onChange: (variants: Variant[]) => void;
}

const DEFAULT_BRANDING: BrandingSettings = {
  primary_color: '#6C5CE7',
  secondary_color: '#00CEC9',
  accent_color: '#1860A5',
  cta_text: 'Pay with USDC',
  cta_background_color: '#0D0F1A',
  cta_text_color: '#FFFFFF',
  show_merchant_name: true,
};

export function ABTestVariantSelector({ variants, onChange }: ABTestVariantSelectorProps) {
  const [error, setError] = useState<string | null>(null);

  const addVariant = () => {
    if (variants.length >= 5) {
      setError('Maximum of 5 variants allowed.');
      return;
    }
    const equalShare = variants.length === 0 ? 100 : Math.floor(100 / (variants.length + 1));
    const remaining = 100 - equalShare;
    const updated = [
      ...variants.map((v, i) => ({
        ...v,
        traffic_percentage: i < variants.length ? Math.floor(remaining / variants.length) : v.traffic_percentage,
      })),
      {
        name: `Variant ${variants.length + 1}`,
        traffic_percentage: equalShare,
        branding: { ...DEFAULT_BRANDING },
      },
    ];
    // Ensure total is exactly 100
    const total = updated.reduce((sum, v) => sum + v.traffic_percentage, 0);
    if (total !== 100 && updated.length > 0) {
      updated[updated.length - 1].traffic_percentage += (100 - total);
    }
    onChange(updated);
    setError(null);
  };

  const removeVariant = (index: number) => {
    if (variants.length <= 2) {
      setError('At least 2 variants are required for an A/B test.');
      return;
    }
    const updated = variants.filter((_, i) => i !== index);
    // Redistribute traffic evenly
    const equalShare = Math.floor(100 / updated.length);
    const redistributed = updated.map((v) => ({ ...v, traffic_percentage: equalShare }));
    const total = redistributed.reduce((sum, v) => sum + v.traffic_percentage, 0);
    if (total !== 100 && redistributed.length > 0) {
      redistributed[redistributed.length - 1].traffic_percentage += (100 - total);
    }
    onChange(redistributed);
    setError(null);
  };

  const updateVariant = (index: number, field: keyof Variant, value: any) => {
    const updated = variants.map((v, i) => {
      if (i !== index) return v;
      return { ...v, [field]: value };
    });
    // If traffic percentage changed, rebalance
    if (field === 'traffic_percentage') {
      const otherTotal = updated
        .filter((_, i) => i !== index)
        .reduce((sum, v) => sum + v.traffic_percentage, 0);
      const newValue = Math.max(0, Math.min(100, Number(value) || 0));
      updated[index].traffic_percentage = newValue;
      // Don't auto-adjust others - let user manage
    }
    onChange(updated);
    setError(null);
  };

  const updateBranding = (index: number, field: keyof BrandingSettings, value: any) => {
    const updated = variants.map((v, i) => {
      if (i !== index) return v;
      return {
        ...v,
        branding: { ...v.branding, [field]: value },
      };
    });
    onChange(updated);
  };

  const totalPercentage = variants.reduce((sum, v) => sum + v.traffic_percentage, 0);
  const isValid = totalPercentage === 100 && variants.length >= 2;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-ink">A/B Test Variants</h4>
          <p className="text-xs text-slate-500">
            Create up to 5 variants and split traffic between them.
          </p>
        </div>
        <Button
          type="button"
          onClick={addVariant}
          disabled={variants.length >= 5}
          className="bg-white text-ink ring-1 ring-slate-300 hover:bg-slate-50"
        >
          <Plus size={14} /> Add Variant
        </Button>
      </div>

      {error && (
        <div className="rounded-md bg-amber-50 p-2 text-xs text-amber-700 border border-amber-200">
          {error}
        </div>
      )}

      {!isValid && variants.length >= 2 && (
        <div className="rounded-md bg-amber-50 p-2 text-xs text-amber-700 border border-amber-200">
          Traffic split must total exactly 100%. Currently: {totalPercentage}%
        </div>
      )}

      <div className="space-y-4">
        {variants.map((variant, index) => (
          <div
            key={index}
            className="rounded-lg border border-slate-200 bg-white p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet/10 text-xs font-semibold text-violet">
                  {String.fromCharCode(65 + index)}
                </span>
                <Input
                  value={variant.name}
                  onChange={(e) => updateVariant(index, 'name', e.target.value)}
                  className="h-8 w-40 text-sm font-medium"
                  placeholder="Variant name"
                />
                {index === 0 && (
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
                    Control
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600"
                title="Remove variant"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Traffic split */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-xs text-slate-500 mb-1 block">Traffic %</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={variant.traffic_percentage}
                    onChange={(e) => updateVariant(index, 'traffic_percentage', parseInt(e.target.value))}
                    className="flex-1 h-2 rounded-full bg-slate-200 accent-violet"
                  />
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={variant.traffic_percentage}
                    onChange={(e) => updateVariant(index, 'traffic_percentage', parseInt(e.target.value) || 0)}
                    className="h-8 w-16 text-center text-xs font-mono"
                  />
                  <span className="text-xs text-slate-500">%</span>
                </div>
              </div>
            </div>

            {/* Traffic bar visualization */}
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100">
              {variants.map((v, i) => (
                <div
                  key={i}
                  className="h-full transition-all"
                  style={{
                    width: `${v.traffic_percentage}%`,
                    backgroundColor:
                      i === index
                        ? '#6C5CE7'
                        : i % 2 === 0
                          ? '#00CEC9'
                          : '#1860A5',
                    opacity: i === index ? 1 : 0.5,
                  }}
                />
              ))}
            </div>

            {/* Branding for this variant */}
            <details className="group">
              <summary className="cursor-pointer text-xs font-medium text-slate-500 hover:text-ink">
                Branding settings for {variant.name}
              </summary>
              <div className="mt-3 space-y-3 border-t border-slate-100 pt-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Primary Colour</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={variant.branding.primary_color}
                        onChange={(e) => updateBranding(index, 'primary_color', e.target.value)}
                        className="h-8 w-8 cursor-pointer rounded border border-slate-300"
                      />
                      <Input
                        value={variant.branding.primary_color}
                        onChange={(e) => updateBranding(index, 'primary_color', e.target.value)}
                        className="h-8 font-mono text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">CTA Text</label>
                    <Input
                      value={variant.branding.cta_text}
                      onChange={(e) => updateBranding(index, 'cta_text', e.target.value)}
                      className="h-8 text-sm"
                      placeholder="Pay with USDC"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">CTA Background</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={variant.branding.cta_background_color}
                        onChange={(e) => updateBranding(index, 'cta_background_color', e.target.value)}
                        className="h-8 w-8 cursor-pointer rounded border border-slate-300"
                      />
                      <Input
                        value={variant.branding.cta_background_color}
                        onChange={(e) => updateBranding(index, 'cta_background_color', e.target.value)}
                        className="h-8 font-mono text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">CTA Text Colour</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={variant.branding.cta_text_color}
                        onChange={(e) => updateBranding(index, 'cta_text_color', e.target.value)}
                        className="h-8 w-8 cursor-pointer rounded border border-slate-300"
                      />
                      <Input
                        value={variant.branding.cta_text_color}
                        onChange={(e) => updateBranding(index, 'cta_text_color', e.target.value)}
                        className="h-8 font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </details>
          </div>
        ))}
      </div>

      {variants.length === 0 && (
        <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center">
          <p className="text-sm text-slate-500">No variants yet. Add at least 2 to start an A/B test.</p>
        </div>
      )}
    </div>
  );
}
