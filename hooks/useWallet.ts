'use client';

import { useState, useCallback } from 'react';
import { AVAILABLE_WALLETS, WalletSigner } from '@/lib/stellar';

export interface WalletConnectionError {
  code: string;
  message: string;
}

/**
 * Manages wallet discovery, connection state, and connection errors.
 *
 * @returns Available wallets, the active wallet, public key, connect action,
 * connection error helpers, and connection progress state.
 *
 * @example
 * const { wallets, publicKey, connect, isConnecting } = useWallet();
 * await connect(wallets[0]);
 */
export function useWallet() {
  const [wallet, setWallet] = useState<WalletSigner | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [error, setError] = useState<WalletConnectionError | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(async (next: WalletSigner): Promise<string | null> => {
    try {
      setIsConnecting(true);
      setError(null);

      // Add timeout for mobile wallets that might take longer to respond
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Wallet connection timeout')), 30000)
      );

      const connectionPromise = (async () => {
        try {
          const key = await next.getPublicKey();
          setWallet(next);
          setPublicKey(key);
          return key;
        } catch (err) {
          // Handle iOS Safari specific errors
          const message = err instanceof Error ? err.message : String(err);
          if (message.includes('Navigation') || message.includes('DOMException')) {
            // iOS Safari deep-link navigation error - retry might help
            setError({
              code: 'NAVIGATION_ERROR',
              message: 'Wallet connection was interrupted. Please ensure the wallet app is installed and try again.',
            });
            return null;
          }
          throw err;
        }
      })();

      return await Promise.race([connectionPromise, timeoutPromise]);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('Wallet connection error:', { wallet: next.name, error: message });

      setError({
        code: 'CONNECTION_ERROR',
        message: `Failed to connect with ${next.name}. ${message}`,
      });
      setWallet(null);
      setPublicKey(null);
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    wallets: AVAILABLE_WALLETS.filter((w) => w.isAvailable()),
    wallet,
    publicKey,
    connect,
    error,
    clearError,
    isConnecting,
  };
}
