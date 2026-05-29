'use client';

import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useSession } from '@/lib/session';
import { useRouter } from 'next/navigation';

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const WARNING_TIME_MS = 2 * 60 * 1000; // 2 minutes before expiry

export function SessionTimeoutModal() {
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let countdownId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      clearInterval(countdownId);
      setShowWarning(false);
      setCountdown(120);

      timeoutId = setTimeout(() => {
        setShowWarning(true);
        setCountdown(120);
        countdownId = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownId);
              session.logout();
              router.push('/login');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, SESSION_TIMEOUT_MS - WARNING_TIME_MS);
    };

    resetTimer();

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((event) => {
      document.addEventListener(event, resetTimer);
    });

    return () => {
      clearTimeout(timeoutId);
      clearInterval(countdownId);
      events.forEach((event) => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [session, router]);

  const handleStaySignedIn = () => {
    setShowWarning(false);
    setCountdown(120);
  };

  const handleLogout = () => {
    session.logout();
    router.push('/login');
  };

  return (
    <Modal isOpen={showWarning} onClose={() => {}}>
      <div className="flex flex-col items-center gap-4">
        <AlertCircle className="text-orange-500" size={32} />
        <h2 className="text-lg font-semibold text-ink">Session Expiring Soon</h2>
        <p className="text-center text-sm text-slate-600">
          Your session will expire in <span className="font-semibold">{countdown} seconds</span>. Stay signed in or log out.
        </p>
        <div className="flex gap-3 w-full">
          <Button onClick={handleStaySignedIn} className="flex-1">
            Stay signed in
          </Button>
          <Button onClick={handleLogout} variant="secondary" className="flex-1">
            Log out
          </Button>
        </div>
      </div>
    </Modal>
  );
}
