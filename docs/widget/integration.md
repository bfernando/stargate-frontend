# Widget SDK Integration Guide

This guide covers how to integrate the Stargate payment widget into your application using script tags, React components, and event callbacks.

## Installation

### Script Tag (One-line Install)

The simplest way to add a payment button to your page:

```html
<script
  src="https://your-domain.com/dist/stargate-widget.js"
  data-invoice-id="inv_xxx"
></script>
```

This automatically injects a styled **Pay Now** button after the script tag. No iframe, no extra markup required.

### Programmatic Usage

For more control over placement and styling:

```html
<div id="pay-btn"></div>
<script src="https://your-domain.com/dist/stargate-widget.js"></script>
<script>
  StargateWidget.mount(document.getElementById('pay-btn'), {
    invoiceId: 'inv_xxx',
    label: 'Pay Now',          // optional, defaults to "Pay Now"
    origin: 'https://your-domain.com',  // optional, defaults to same origin
  });
</script>
```

## React Component Usage

If you're using React, you can integrate the widget as a component:

```tsx
import { useEffect, useRef } from 'react';

export function PaymentButton({ invoiceId }: { invoiceId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Load the widget script if not already loaded
    if (typeof window !== 'undefined' && !(window as any).StargateWidget) {
      const script = document.createElement('script');
      script.src = 'https://your-domain.com/dist/stargate-widget.js';
      script.async = true;
      document.body.appendChild(script);
    }

    // Mount the widget once it's available
    const checkWidget = setInterval(() => {
      if ((window as any).StargateWidget) {
        (window as any).StargateWidget.mount(containerRef.current, {
          invoiceId,
          label: 'Pay Now',
        });
        clearInterval(checkWidget);
      }
    }, 100);

    return () => clearInterval(checkWidget);
  }, [invoiceId]);

  return <div ref={containerRef} />;
}
```

## Event Callbacks

The widget communicates with your page via the `postMessage` API. Listen for these events:

### STARGATE_LOADED

Fired when the widget is ready for interaction.

```javascript
window.addEventListener('message', (event) => {
  if (event.data.type === 'STARGATE_LOADED') {
    console.log('Widget ready for invoice', event.data.invoiceId);
  }
});
```

### STARGATE_PAID

Fired when payment is successfully confirmed.

```javascript
window.addEventListener('message', (event) => {
  if (event.data.type === 'STARGATE_PAID') {
    const { invoiceId, txHash } = event.data;
    console.log(`Invoice ${invoiceId} paid — tx ${txHash}`);
    // Redirect to thank-you page or show success message
  }
});
```

### STARGATE_ERROR

Fired when an error occurs during payment.

```javascript
window.addEventListener('message', (event) => {
  if (event.data.type === 'STARGATE_ERROR') {
    const { invoiceId, code, message } = event.data;
    console.error(`[${code}] ${message}`);
    // Show error banner to user
  }
});
```

## Error Codes

| Code | Meaning |
|------|---------|
| `WALLET_CONNECTION_FAILED` | Could not connect to wallet |
| `WALLET_ACCESS_DENIED` | User denied wallet access |
| `COMPLIANCE_BLOCKED` | Address blocked by screening |
| `TX_PREPARATION_FAILED` | Backend could not prepare transaction |
| `TX_SIGNING_FAILED` | Wallet refused to sign |
| `TX_SUBMISSION_FAILED` | Horizon rejected transaction |
| `UNKNOWN` | Unexpected error |

## Complete Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>Payment Page</title>
</head>
<body>
  <h1>Complete Your Payment</h1>
  <div id="payment-widget"></div>

  <script src="https://your-domain.com/dist/stargate-widget.js"></script>
  <script>
    const ALLOWED_ORIGIN = 'https://your-domain.com';
    const invoiceId = 'inv_xxx';

    // Mount the widget
    StargateWidget.mount(document.getElementById('payment-widget'), {
      invoiceId,
      label: 'Pay with USDC',
    });

    // Listen for events
    window.addEventListener('message', (event) => {
      // Always verify origin in production
      if (event.origin !== ALLOWED_ORIGIN) return;

      const { type, invoiceId: eventInvoiceId, txHash, code, message } = event.data;

      switch (type) {
        case 'STARGATE_LOADED':
          console.log(`Widget loaded for invoice ${eventInvoiceId}`);
          break;

        case 'STARGATE_PAID':
          console.log(`Payment successful! Transaction: ${txHash}`);
          // Redirect to success page
          window.location.href = '/success?invoice=' + eventInvoiceId;
          break;

        case 'STARGATE_ERROR':
          console.error(`Payment failed: [${code}] ${message}`);
          // Show error message
          document.getElementById('error-message').textContent = message;
          break;
      }
    });
  </script>
</body>
</html>
```

## Security Considerations

1. **Always verify `event.origin`** in production to prevent cross-origin message spoofing
2. **Use HTTPS** for all payment pages
3. **Never expose API keys** in client-side code
4. **Validate payments** on your backend using webhook signatures

## Webhook Verification

After receiving a `STARGATE_PAID` event, verify the payment on your backend:

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expected = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}
```

## Support

For issues or questions, refer to the [Widget SDK documentation](../widget-sdk.md) or contact support.
