'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export function TestModeToggle() {
  const [isTestMode, setIsTestMode] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('stargate_test_mode') === 'true' : false
  );

  const handleToggle = () => {
    const newMode = !isTestMode;
    setIsTestMode(newMode);
    localStorage.setItem('stargate_test_mode', String(newMode));
    window.location.reload();
  };

  return (
    <Button
      onClick={handleToggle}
      variant={isTestMode ? 'secondary' : 'primary'}
      className="text-xs"
    >
      {isTestMode ? 'Exit Test Mode' : 'Enable Test Mode'}
    </Button>
  );
}
