'use client';

import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';

export function TestModeBanner() {
  const [isTestMode, setIsTestMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('stargate_test_mode') === 'true';
    setIsTestMode(savedMode);
  }, []);

  const toggleTestMode = () => {
    const newMode = !isTestMode;
    setIsTestMode(newMode);
    localStorage.setItem('stargate_test_mode', String(newMode));
    window.location.reload();
  };

  if (!isTestMode) return null;

  return (
    <div className="flex items-center justify-between gap-4 bg-orange-50 border-b border-orange-200 px-6 py-3">
      <div className="flex items-center gap-2">
        <AlertCircle className="text-orange-600" size={18} />
        <span className="text-sm font-medium text-orange-900">Test Mode Enabled - Using Testnet Data</span>
      </div>
      <button
        onClick={toggleTestMode}
        className="text-xs font-medium text-orange-600 hover:text-orange-700 underline"
      >
        Disable
      </button>
    </div>
  );
}
