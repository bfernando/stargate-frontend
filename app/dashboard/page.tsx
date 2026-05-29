import type { Metadata } from 'next';
import { DashboardPageClient } from './_client';

import { OnboardingChecklist } from '@/components/dashboard/OnboardingChecklist';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { BalanceWidget } from '@/components/dashboard/BalanceWidget';
import { InvoiceTable } from '@/components/invoices/InvoiceTable';
import { useInvoices } from '@/hooks/useInvoices';

export default function DashboardPage() {
  const { data } = useInvoices('?limit=10');
  const invoices = data?.items ?? [];
  return (
    <div className="space-y-6">
      <OnboardingChecklist />
      <StatsCards invoices={invoices} />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">Recent invoices</h2>
          <InvoiceTable invoices={invoices} />
        </section>
        <BalanceWidget />
      </div>
    </div>
  );
export const metadata: Metadata = {
  title: 'Dashboard – Stargate',
  description: 'Overview of your Stargate merchant account: revenue, recent invoices, and onboarding status.',
};

export default function DashboardPage() {
  return <DashboardPageClient />;
}
