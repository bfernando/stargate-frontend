import { Badge } from '@/components/ui/Badge';

const versions = [
  {
    version: '2.1.0',
    date: '2026-05-28',
    type: 'minor',
    changes: {
      added: [
        'Support for custom styling via CSS variables',
        'New `onSuccess` callback for payment completion',
        'Webhook event validation in widget',
      ],
      changed: [
        'Improved error messaging for compliance failures',
        'Enhanced accessibility for keyboard navigation',
      ],
      fixed: [
        'Fixed memory leak in event listener cleanup',
        'Corrected transaction hash encoding in STARGATE_PAID event',
      ],
    },
  },
  {
    version: '2.0.0',
    date: '2026-04-15',
    type: 'major',
    breaking: true,
    changes: {
      added: [
        'Support for multiple wallet providers (Freighter, Albedo)',
        'Real-time transaction status updates via SSE',
        'QR code generation for payment links',
      ],
      changed: [
        'Renamed `PAYMENT_COMPLETE` event to `STARGATE_PAID`',
        'Changed event payload structure to include `invoiceId` and `txHash`',
        'Migrated from REST polling to Server-Sent Events for status updates',
      ],
      removed: [
        'Legacy `postMessage` format for older browsers',
      ],
    },
    migration: `// Old (v1.x)
window.addEventListener('message', (event) => {
  if (event.data.type === 'PAYMENT_COMPLETE') {
    console.log('Payment:', event.data.transactionId);
  }
});

// New (v2.0+)
window.addEventListener('message', (event) => {
  if (event.data.type === 'STARGATE_PAID') {
    console.log('Payment:', event.data.txHash);
  }
});`,
  },
  {
    version: '1.5.0',
    date: '2026-03-01',
    type: 'minor',
    changes: {
      added: [
        'Support for invoice expiration warnings',
        'Muxed account address display',
      ],
      fixed: [
        'Fixed CORS issues with embedded iframes',
        'Corrected QR code sizing on mobile devices',
      ],
    },
  },
  {
    version: '1.0.0',
    date: '2026-01-15',
    type: 'major',
    changes: {
      added: [
        'Initial release of Stargate Widget SDK',
        'Basic payment flow with wallet connection',
        'Invoice detail display',
        'Payment status tracking',
      ],
    },
  },
];

export default function WidgetChangelogPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink mb-2">Widget SDK Changelog</h1>
        <p className="text-slate-600">Version history, breaking changes, and migration guides for the Stargate Widget SDK.</p>
      </div>

      <div className="space-y-8">
        {versions.map((release) => (
          <div key={release.version} className="border border-slate-200 rounded-lg p-6 bg-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-ink">v{release.version}</h2>
                <Badge status={release.breaking ? 'error' : release.type === 'major' ? 'success' : 'info'}>
                  {release.breaking ? 'Breaking' : release.type === 'major' ? 'Major' : 'Minor'}
                </Badge>
              </div>
              <time className="text-sm text-slate-500">{new Date(release.date).toLocaleDateString()}</time>
            </div>

            <div className="space-y-4">
              {release.changes.added && (
                <div>
                  <h3 className="font-semibold text-sm text-mint mb-2">Added</h3>
                  <ul className="space-y-1">
                    {release.changes.added.map((item, i) => (
                      <li key={i} className="text-sm text-slate-700 flex gap-2">
                        <span className="text-mint">+</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {release.changes.changed && (
                <div>
                  <h3 className="font-semibold text-sm text-orange-600 mb-2">Changed</h3>
                  <ul className="space-y-1">
                    {release.changes.changed.map((item, i) => (
                      <li key={i} className="text-sm text-slate-700 flex gap-2">
                        <span className="text-orange-600">~</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {release.changes.fixed && (
                <div>
                  <h3 className="font-semibold text-sm text-blue-600 mb-2">Fixed</h3>
                  <ul className="space-y-1">
                    {release.changes.fixed.map((item, i) => (
                      <li key={i} className="text-sm text-slate-700 flex gap-2">
                        <span className="text-blue-600">✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {release.changes.removed && (
                <div>
                  <h3 className="font-semibold text-sm text-red-600 mb-2">Removed</h3>
                  <ul className="space-y-1">
                    {release.changes.removed.map((item, i) => (
                      <li key={i} className="text-sm text-slate-700 flex gap-2">
                        <span className="text-red-600">-</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {release.migration && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <h3 className="font-semibold text-sm text-ink mb-2">Migration Guide</h3>
                  <pre className="bg-slate-50 p-3 rounded text-xs overflow-x-auto text-slate-700">
                    <code>{release.migration}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
