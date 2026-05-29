import type { Invoice, PublicInvoice } from '@/types/api';

export const invoiceFixture: Invoice = {
  id: 'inv_test_001',
  merchant_id: 'merchant_test_001',
  amount_usdc: '100.00',
  gross_usdc: '100.00',
  fee_usdc: '1.00',
  net_usdc: '99.00',
  description: 'Test invoice',
  status: 'pending',
  muxed_address: 'MAAAAAAAAAAAAAB7BQ2L7E5NBWMXDUCMZSIPOBKRDSBYVLMXGSSKF6YNPIB7Y77ITKNOG',
  payment_url: 'https://app.example.com/pay/inv_test_001',
  expires_at: '2099-01-01T00:00:00.000Z',
  created_at: '2024-01-01T00:00:00.000Z',
};

export const paidInvoiceFixture: Invoice = {
  ...invoiceFixture,
  id: 'inv_test_002',
  status: 'paid',
  paid_at: '2024-01-01T01:00:00.000Z',
};

export const publicInvoiceFixture: PublicInvoice = {
  id: invoiceFixture.id,
  gross_usdc: invoiceFixture.gross_usdc,
  description: invoiceFixture.description,
  merchant_name: 'Test Merchant',
  status: invoiceFixture.status,
  muxed_address: invoiceFixture.muxed_address,
  expires_at: invoiceFixture.expires_at,
};

export interface WalletBalance {
  asset: string;
  balance: string;
  limit?: string;
}

export const walletBalanceFixture: WalletBalance = {
  asset: 'USDC',
  balance: '500.00',
};

export const walletBalancesFixture: WalletBalance[] = [
  { asset: 'XLM', balance: '100.0000000' },
  { asset: 'USDC', balance: '500.00', limit: '10000.00' },
];
