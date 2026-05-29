# Widget SDK Changelog

All notable changes to the Stargate Widget SDK are documented here.

## [2.1.0] - 2026-05-28

### Added
- Support for custom styling via CSS variables
- New `onSuccess` callback for payment completion
- Webhook event validation in widget

### Changed
- Improved error messaging for compliance failures
- Enhanced accessibility for keyboard navigation

### Fixed
- Fixed memory leak in event listener cleanup
- Corrected transaction hash encoding in STARGATE_PAID event

## [2.0.0] - 2026-04-15

### Added
- Support for multiple wallet providers (Freighter, Albedo)
- Real-time transaction status updates via SSE
- QR code generation for payment links

### Changed
- **BREAKING**: Renamed `PAYMENT_COMPLETE` event to `STARGATE_PAID`
- **BREAKING**: Changed event payload structure to include `invoiceId` and `txHash`
- Migrated from REST polling to Server-Sent Events for status updates

### Removed
- Legacy `postMessage` format for older browsers

### Migration Guide
```javascript
// Old (v1.x)
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
});
```

## [1.5.0] - 2026-03-01

### Added
- Support for invoice expiration warnings
- Muxed account address display

### Fixed
- Fixed CORS issues with embedded iframes
- Corrected QR code sizing on mobile devices

## [1.0.0] - 2026-01-15

### Added
- Initial release of Stargate Widget SDK
- Basic payment flow with wallet connection
- Invoice detail display
- Payment status tracking
