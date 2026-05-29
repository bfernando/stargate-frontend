import type { Metadata } from 'next';
import { PayPageClient } from './_client';

export const metadata: Metadata = {
  title: 'Pay – Stargate',
  description: 'Complete your USDC payment on the Stellar network.',
};

export default function PayPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [seconds, setSeconds] = useState(0);
  const status = useInvoiceStatus(params.id);
  useEffect(() => {
    const timer = setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (status.status === 'paid') router.push(`/pay/${params.id}/success`);
  }, [status.status, router, params.id]);
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-4 p-6">
      <noscript>
        <div className="rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-medium">JavaScript is required to complete this payment.</p>
          <p className="mt-1">Please enable JavaScript in your browser, or contact support at <a href="mailto:support@stargate.finance" className="underline">support@stargate.finance</a> for assistance.</p>
        </div>
      </noscript>
      <div className="text-sm text-slate-500">Elapsed {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</div>
      <PaymentWidget invoiceId={params.id} />
    </main>
  );
  return <PayPageClient id={params.id} />;
}
