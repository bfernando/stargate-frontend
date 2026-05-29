import './globals.css';
import type { Metadata } from 'next';
import { SessionProvider } from '@/lib/session';
import { MSWProvider } from '@/components/MSWProvider';

export const metadata: Metadata = {
  title: 'Stargate',
  description: 'USDC payments on Stellar',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Stargate',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#7c3aed" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Stargate" />
      </head>
      <body>
        <SessionProvider>{children}</SessionProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js').catch(() => {});
              }
            `,
          }}
        />
        <MSWProvider>
          <SessionProvider>{children}</SessionProvider>
        </MSWProvider>
      </body>
    </html>
  );
}
