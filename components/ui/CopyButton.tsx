'use client';

import { Check, Copy } from 'lucide-react';
import { useCallback, useState } from 'react';

interface CopyButtonProps {
  /** The text value to copy to the clipboard */
  value: string;
  /** Optional extra class names for the button element */
  className?: string;
  /** Accessible label (defaults to "Copy to clipboard") */
  label?: string;
}

/**
 * A small icon button that copies `value` to the clipboard and briefly
 * shows a "Copied!" tooltip to confirm the action.
 */
export function CopyButton({ value, className = '', label = 'Copy to clipboard' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for environments where clipboard API is unavailable
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [value]);

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? 'Copied!' : label}
        className={`inline-flex h-7 w-7 items-center justify-center rounded text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/50 ${className}`}
      >
        {copied ? (
          <Check size={14} className="text-emerald-500" aria-hidden="true" />
        ) : (
          <Copy size={14} aria-hidden="true" />
        )}
      </button>

      {/* Tooltip */}
      {copied && (
        <span
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-[11px] font-medium text-white shadow"
        >
          Copied!
        </span>
      )}
    </div>
  );
}
