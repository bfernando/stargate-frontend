import { http, HttpResponse } from 'msw';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const merchant = {
  id: 'merchant-1',
  email: 'demo@stargate.dev',
  name: 'Demo Merchant',
  status: 'active',
  tier: 'pro',
  stellar_address: 'GDEMO...XYZ',
  created_at: '2024-01-01T00:00:00Z',
};

const invoice = {
  id: 'inv-1',
  merchant_id: 'merchant-1',
  amount_usdc: '100.00',
  gross_usdc: '100.00',
  fee_usdc: '1.00',
  net_usdc: '99.00',
  description: 'Test invoice',
  status: 'pending',
  muxed_address: 'MDEMO...XYZ',
  payment_url: 'http://localhost:3000/pay/inv-1',
  expires_at: new Date(Date.now() + 3600_000).toISOString(),
  created_at: '2024-01-01T00:00:00Z',
};

const teamMember = {
  id: 'member-1',
  merchant_id: 'merchant-1',
  email: 'dev@stargate.dev',
  name: 'Dev User',
  role: 'developer',
  status: 'active',
  invited_at: '2024-01-01T00:00:00Z',
};

const dispute = {
  id: 'dispute-1',
  invoice_id: 'inv-1',
  merchant_id: 'merchant-1',
  amount_usdc: '100.00',
  reason: 'fraudulent',
  status: 'open',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const handlers = [
  // Auth
  http.post(`${API_URL}/auth/login`, () =>
    HttpResponse.json({ access_token: 'mock-token', token_type: 'Bearer', expires_in: 3600, merchant })
  ),
  http.post(`${API_URL}/auth/register`, () =>
    HttpResponse.json({ access_token: 'mock-token', token_type: 'Bearer', expires_in: 3600, merchant })
  ),
  http.post(`${API_URL}/auth/refresh`, () =>
    HttpResponse.json({ access_token: 'mock-token', token_type: 'Bearer', expires_in: 3600 })
  ),
  http.post(`${API_URL}/auth/logout`, () => HttpResponse.json({})),
  http.post(`${API_URL}/auth/totp/init`, () =>
    HttpResponse.json({ secret: 'MOCK_SECRET', qr_code_url: 'otpauth://totp/mock' })
  ),
  http.post(`${API_URL}/auth/totp/verify`, () =>
    HttpResponse.json({ backup_codes: ['code1', 'code2', 'code3'] })
  ),
  http.post(`${API_URL}/auth/totp/confirm`, () => HttpResponse.json({})),
  http.post(`${API_URL}/auth/totp/disable`, () => HttpResponse.json({})),
  http.get(`${API_URL}/auth/totp/status`, () =>
    HttpResponse.json({ enabled: false })
  ),

  // Merchants
  http.get(`${API_URL}/merchants/me`, () => HttpResponse.json(merchant)),
  http.patch(`${API_URL}/merchants/me`, () => HttpResponse.json(merchant)),

  // Invoices
  http.get(`${API_URL}/invoices`, () =>
    HttpResponse.json({ page: 1, limit: 20, total: 1, items: [invoice] })
  ),
  http.post(`${API_URL}/invoices`, () => HttpResponse.json(invoice)),
  http.get(`${API_URL}/invoices/:id`, () => HttpResponse.json(invoice)),
  http.post(`${API_URL}/invoices/:id/cancel`, () =>
    HttpResponse.json({ ...invoice, status: 'cancelled' })
  ),
  http.get(`${API_URL}/invoices/public/:id`, () =>
    HttpResponse.json({
      id: invoice.id,
      gross_usdc: invoice.gross_usdc,
      description: invoice.description,
      merchant_name: merchant.name,
      status: invoice.status,
      muxed_address: invoice.muxed_address,
      expires_at: invoice.expires_at,
    })
  ),

  // Payments
  http.get(`${API_URL}/payments/:id/prepare-tx`, () =>
    HttpResponse.json({ xdr: 'AAAA...mock_xdr', network: 'testnet' })
  ),

  // Compliance
  http.post(`${API_URL}/compliance/screen`, () =>
    HttpResponse.json({ result: 'clear' })
  ),

  // Team
  http.get(`${API_URL}/team`, () =>
    HttpResponse.json({ page: 1, limit: 20, total: 1, items: [teamMember] })
  ),
  http.post(`${API_URL}/team/invite`, () => HttpResponse.json(teamMember)),
  http.get(`${API_URL}/team/:id`, () => HttpResponse.json(teamMember)),
  http.patch(`${API_URL}/team/:id`, () => HttpResponse.json(teamMember)),
  http.delete(`${API_URL}/team/:id`, () => HttpResponse.json({})),
  http.post(`${API_URL}/team/:id/resend`, () => HttpResponse.json({})),

  // Webhooks
  http.get(`${API_URL}/webhooks`, () => HttpResponse.json([])),
  http.post(`${API_URL}/webhooks`, () =>
    HttpResponse.json({ id: 'wh-1', url: 'https://example.com/hook', events: ['invoice.paid'] })
  ),
  http.delete(`${API_URL}/webhooks/:id`, () => HttpResponse.json({})),
  http.get(`${API_URL}/webhooks/:id/deliveries`, () => HttpResponse.json([])),
  http.post(`${API_URL}/webhooks/deliveries/:id/retry`, () => HttpResponse.json({})),

  // Analytics
  http.get(`${API_URL}/analytics/revenue`, () =>
    HttpResponse.json([
      { date: '2024-01-01', amount: 1000 },
      { date: '2024-01-02', amount: 1500 },
    ])
  ),
  http.get(`${API_URL}/analytics/top-links`, () => HttpResponse.json([])),
  http.get(`${API_URL}/analytics/conversion-funnel`, () =>
    HttpResponse.json({ views: 100, clicks: 50, payments: 20 })
  ),
  http.get(`${API_URL}/analytics/summary`, () =>
    HttpResponse.json({ total_revenue: 5000, total_invoices: 42, paid_invoices: 38 })
  ),

  // Disputes
  http.get(`${API_URL}/disputes`, () =>
    HttpResponse.json({ page: 1, limit: 20, total: 1, items: [dispute] })
  ),
  http.get(`${API_URL}/disputes/:id`, () => HttpResponse.json(dispute)),
  http.post(`${API_URL}/disputes/:id/respond`, () =>
    HttpResponse.json({ ...dispute, status: 'under_review' })
  ),
  http.post(`${API_URL}/disputes/:id/evidence`, () => HttpResponse.json({})),
  http.get(`${API_URL}/disputes/:id/timeline`, () =>
    HttpResponse.json([
      { id: 'evt-1', dispute_id: 'dispute-1', event_type: 'created', description: 'Dispute opened', created_at: '2024-01-01T00:00:00Z' },
    ])
  ),
];
