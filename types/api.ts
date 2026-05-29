export interface Merchant {
  id: string;
  email: string;
  name: string;
  status: 'pending' | 'active' | 'suspended';
  tier: 'standard' | 'pro' | 'enterprise';
  stellar_address?: string;
  settlement_cadence?: 'daily' | 'weekly';
  created_at: string;
}

export interface RegisterDto {
  email: string;
  name: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthTokens {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  merchant?: Merchant;
}

export type InvoiceStatus = 'pending' | 'paid' | 'expired' | 'cancelled';

export interface CreateInvoiceDto {
  amount_usdc: number;
  description?: string;
  expires_in_minutes?: number;
}

export interface Invoice {
  id: string;
  merchant_id: string;
  amount_usdc: string;
  gross_usdc: string;
  fee_usdc: string;
  net_usdc: string;
  description?: string;
  status: InvoiceStatus;
  muxed_address: string;
  payment_url: string;
  expires_at: string;
  paid_at?: string;
  created_at: string;
}

export interface InvoiceListResponse {
  page: number;
  limit: number;
  total: number;
  items: Invoice[];
}

export interface PublicInvoice {
  id: string;
  gross_usdc: string;
  description?: string;
  merchant_name: string;
  status: InvoiceStatus;
  muxed_address: string;
  expires_at: string;
}

export type DisputeStatus = 'open' | 'under_review' | 'resolved' | 'closed' | 'won' | 'lost';
export type DisputeReason = 'fraudulent' | 'duplicate' | 'product_not_received' | 'product_unacceptable' | 'other';

export interface Dispute {
  id: string;
  invoice_id: string;
  merchant_id: string;
  amount_usdc: string;
  reason: DisputeReason;
  status: DisputeStatus;
  customer_email?: string;
  customer_message?: string;
  merchant_response?: string;
  evidence_files?: string[];
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  resolution_notes?: string;
}

export interface DisputeListResponse {
  page: number;
  limit: number;
  total: number;
  items: Dispute[];
}

export interface DisputeTimelineEvent {
  id: string;
  dispute_id: string;
  event_type: 'created' | 'evidence_submitted' | 'status_changed' | 'message_added' | 'resolved';
  description: string;
  metadata?: Record<string, any>;
  created_at: string;
  created_by?: string;
}

export interface CreateDisputeResponseDto {
  message: string;
  evidence_files?: File[];
}

export interface UploadEvidenceDto {
  file: File;
  description?: string;
}

export type TeamMemberRole = 'owner' | 'admin' | 'developer' | 'viewer';
export type TeamMemberStatus = 'active' | 'pending' | 'suspended';

export interface TeamMember {
  id: string;
  merchant_id: string;
  email: string;
  name?: string;
  role: TeamMemberRole;
  status: TeamMemberStatus;
  invited_by?: string;
  invited_at: string;
  accepted_at?: string;
  last_active?: string;
}

export interface TeamMemberListResponse {
  page: number;
  limit: number;
  total: number;
  items: TeamMember[];
}

export interface InviteTeamMemberDto {
  email: string;
  role: TeamMemberRole;
  name?: string;
}

export interface UpdateTeamMemberDto {
  role?: TeamMemberRole;
  status?: TeamMemberStatus;
}

// ─── Multi-currency display ────────────────────────────────────────────────
export type CurrencyDisplayMode = 'settlement' | 'original';

export interface CurrencyDisplaySettings {
  mode: CurrencyDisplayMode;
  settlement_currency: string;
}

// ─── Audit log ─────────────────────────────────────────────────────────────
export type AuditAction =
  | 'merchant.updated'
  | 'invoice.created'
  | 'invoice.cancelled'
  | 'payment.received'
  | 'webhook.created'
  | 'webhook.deleted'
  | 'team.invited'
  | 'team.removed'
  | 'team.role_changed'
  | 'dispute.opened'
  | 'dispute.responded'
  | 'settings.changed'
  | 'api_key.generated'
  | 'api_key.revoked'
  | 'login'
  | 'logout'
  | 'branding.updated'
  | 'ab_test.created'
  | 'ab_test.updated';

export interface AuditLogEntry {
  id: string;
  merchant_id: string;
  actor_email: string;
  action: AuditAction;
  resource_type: string;
  resource_id?: string;
  details?: Record<string, any>;
  ip_address: string;
  user_agent?: string;
  created_at: string;
}

export interface AuditLogListResponse {
  page: number;
  limit: number;
  total: number;
  items: AuditLogEntry[];
}

// ─── Branding / Payment page customisation ─────────────────────────────────
export interface BrandingSettings {
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  cta_text: string;
  cta_background_color: string;
  cta_text_color: string;
  font_family?: string;
  show_merchant_name: boolean;
}

// ─── A/B test variants ─────────────────────────────────────────────────────
export interface ABTestVariant {
  id: string;
  name: string;
  traffic_percentage: number;
  branding: BrandingSettings;
  is_control: boolean;
}

export interface ABTest {
  id: string;
  merchant_id: string;
  name: string;
  description?: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  variants: ABTestVariant[];
  created_at: string;
  updated_at: string;
}

export interface CreateABTestDto {
  name: string;
  description?: string;
  variants: {
    name: string;
    traffic_percentage: number;
    branding: BrandingSettings;
  }[];
export interface ApiKey {
  id: string;
  merchant_id: string;
  name: string;
  key: string;
  scopes: string[];
  last_used_at?: string;
  created_at: string;
  revoked_at?: string;
}

export interface ApiKeyListResponse {
  page: number;
  limit: number;
  total: number;
  items: ApiKey[];
}

export interface CreateApiKeyDto {
  name: string;
  scopes: string[];
}

export interface UpdateApiKeyDto {
  name?: string;
}

export interface WebhookDelivery {
  id: string;
  webhook_id: string;
  event: string;
  status: 'pending' | 'success' | 'failed';
  response_status?: number;
  response_body?: string;
  latency_ms: number;
  created_at: string;
}

export interface WebhookDeliveryListResponse {
  page: number;
  limit: number;
  total: number;
  items: WebhookDelivery[];
}

export interface InvoiceTimeline {
  id: string;
  invoice_id: string;
  event_type: 'created' | 'viewed' | 'paid' | 'settled' | 'expired' | 'cancelled';
  description: string;
  created_at: string;
}

export interface MerchantBalance {
  usdc: string;
  eurc: string;
  xlm: string;
  updated_at: string;
}
