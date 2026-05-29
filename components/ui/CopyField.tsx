'use client';

import { CopyButton } from './CopyButton';

interface CopyFieldProps {
  /** The sensitive value to display and copy */
  value: string;
  /** Optional label rendered above the field */
  label?: string;
  /** When true the value is masked with bullets (e.g. for secrets) */
  masked?: boolean;
}

/**
 * A read-only text field paired with a CopyButton.
 * Use for API keys, webhook secrets, wallet addresses, and any other
 * sensitive string that users need to copy but not edit.
 */
export function CopyField({ value, label, masked = false }: CopyFieldProps) {
  const display = masked ? '•'.repeat(Math.min(value.length, 32)) : value;

  return (
    <div className="space-y-1">
      {label && <p className="text-xs font-medium text-slate-500">{label}</p>}
      <div className="flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
        <span className="flex-1 truncate font-mono text-sm text-ink" title={masked ? undefined : value}>
          {display}
        </span>
        <CopyButton value={value} label={`Copy ${label ?? 'value'}`} />
      </div>
    </div>
  );
}
