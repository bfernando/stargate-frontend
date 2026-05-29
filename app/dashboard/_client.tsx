'use client';

import { OnboardingChecklist } from '@/components/dashboard/OnboardingChecklist';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { InvoiceTable } from '@/components/invoices/InvoiceTable';
import { useInvoices } from '@/hooks/useInvoices';

export function DashboardPageClient() {
  const { data } = useInvoices('?limit=10');
  const invoices = data?.items ?? [];
  return (
    <div className="space-y-6">
      <OnboardingChecklist />
      <StatsCards invoices={invoices} />
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-ink">Recent invoices</h2>
        <InvoiceTable invoices={invoices} />
      </section>
    </div>
  );
}
