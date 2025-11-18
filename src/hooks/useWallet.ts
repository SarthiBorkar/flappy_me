'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Address } from 'viem';
import {
  detectMiniPay,
  connectWallet,
  getCurrentAccount,
  getBalances,
  verifyNetwork,
  switchNetwork,
  onAccountsChanged,
  onChainChanged,
  onDisconnect,
  removeListener,
} from '@/utils/web3Client';
import {
  WALLET_CONFIG,
  ERROR_MESSAGES,
  IS_DEBUG,
  STORAGE_KEYS,
} from '@/utils/constants';
import type { UseWalletReturn } from '@/types';

/**
 * useWallet Hook
 *
 * Manages wallet connection, account state, and balances for MiniPay integration
 *
 * Features:
 * - Auto-detect MiniPay
 * - Auto-connect on mount
 * - Listen for account/network changes
 * - Periodic balance refresh
 * - Error handling
 *
 * @returns {UseWalletReturn} Wallet state and functions
 */
export const useWallet = (): UseWalletReturn => {
  // ============================================
  // STATE MANAGEMENT
  // ============================================

  const [address, setAddress] = useState<Address | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMiniPay, setIsMiniPay] = useState(false);
  const [balance, setBalance] = useState({
    cUSD: '0',
    CELO: '0',
  });
  const [error, setError] = useState<string | null>(null);

  // Refs for cleanup
  const balanceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // ============================================
  // BALANCE REFRESH
  // ============================================

  const refreshBalance = useCallback(async () => {
    if (!address) {
      if (IS_DEBUG) {
        console.log('⏭️ Skipping balance refresh: No address');
      }
      return;
    }

    try {
      if (IS_DEBUG) {
        console.log('🔄 Refreshing balance for:', address);
      }

      const balances = await getBalances(address);

      if (isMountedRef.current) {
        setBalance(balances);
        setError(null);

        if (IS_DEBUG) {
          console.log('✅ Balance refreshed:', balances);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.NETWORK_ERROR;

      if (isMountedRef.current) {
        setError(errorMessage);
        console.error('❌ Balance refresh failed:', err);
      }
    }
  }, [address]);

  // ============================================
  // WALLET CONNECTION
  // ============================================

  const connect = useCallback(async () => {
    if (isConnecting || isConnected) {
      if (IS_DEBUG) {
        console.log('⏭️ Connection already in progress or established');
      }
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Check if wallet exists
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error(ERROR_MESSAGES.WALLET_NOT_FOUND);
      }

      // Verify network
      const isCorrectNetwork = await verifyNetwork();
      if (!isCorrectNetwork) {
        if (IS_DEBUG) {
          console.log('⚠️ Wrong network detected, attempting to switch...');
        }

        const switched = await switchNetwork();
        if (!switched) {
          throw new Error(ERROR_MESSAGES.WRONG_NETWORK);
        }
      }

      // Connect wallet
      const connectedAddress = await connectWallet();

      if (!connectedAddress) {
        throw new Error(ERROR_MESSAGES.CONNECTION_REJECTED);
      }

      if (isMountedRef.current) {
        setAddress(connectedAddress);
        setIsConnected(true);

        // Store address in localStorage
        localStorage.setItem(STORAGE_KEYS.WALLET_ADDRESS, connectedAddress);

        // Fetch balances
        await refreshBalance();

        if (IS_DEBUG) {
          console.log('✅ Wallet connected successfully:', connectedAddress);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.UNKNOWN_ERROR;

      if (isMountedRef.current) {
        setError(errorMessage);
        setIsConnected(false);
        console.error('❌ Wallet connection failed:', err);
      }
    } finally {
      if (isMountedRef.current) {
        setIsConnecting(false);
      }
    }
  }, [isConnecting, isConnected, refreshBalance]);

  // ============================================
  // WALLET DISCONNECTION
  // ============================================

  const disconnect = useCallback(() => {
    if (IS_DEBUG) {
      console.log('🔌 Disconnecting wallet...');
    }

    setAddress(null);
    setIsConnected(false);
    setBalance({ cUSD: '0', CELO: '0' });
    setError(null);

    // Clear localStorage
    localStorage.removeItem(STORAGE_KEYS.WALLET_ADDRESS);

    // Clear balance refresh interval
    if (balanceIntervalRef.current) {
      clearInterval(balanceIntervalRef.current);
      balanceIntervalRef.current = null;
    }

    if (IS_DEBUG) {
      console.log('✅ Wallet disconnected');
    }
  }, []);

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleAccountsChanged = useCallback(
    (accounts: Address[]) => {
      if (IS_DEBUG) {
        console.log('👤 Accounts changed:', accounts);
      }

      if (accounts.length === 0) {
        // User disconnected
        disconnect();
      } else if (accounts[0] !== address) {
        // User switched accounts
        setAddress(accounts[0]);
        localStorage.setItem(STORAGE_KEYS.WALLET_ADDRESS, accounts[0]);
        refreshBalance();
      }
    },
    [address, disconnect, refreshBalance]
  );

  const handleChainChanged = useCallback(() => {
    if (IS_DEBUG) {
      console.log('⛓️ Chain changed, reloading...');
    }

    // Reload page on chain change (recommended by MetaMask/MiniPay)
    window.location.reload();
  }, []);

  const handleDisconnect = useCallback(() => {
    if (IS_DEBUG) {
      console.log('🔌 Wallet disconnected (event)');
    }

    disconnect();
  }, [disconnect]);

  // ============================================
  // AUTO-CONNECT & INITIALIZATION
  // ============================================

  useEffect(() => {
    const initialize = async () => {
      // Check if running in browser
      if (typeof window === 'undefined') {
        return;
      }

      // Detect MiniPay
      const miniPayDetected = detectMiniPay();
      setIsMiniPay(miniPayDetected);

      if (IS_DEBUG) {
        console.log('🔍 MiniPay detected:', miniPayDetected);
      }

      // Auto-connect if enabled and wallet exists
      if (WALLET_CONFIG.AUTO_CONNECT && window.ethereum) {
        try {
          // Check if previously connected
          const previousAddress = localStorage.getItem(STORAGE_KEYS.WALLET_ADDRESS);
          const currentAccount = await getCurrentAccount();

          if (currentAccount && (!previousAddress || previousAddress === currentAccount)) {
            if (IS_DEBUG) {
              console.log('🔄 Auto-connecting to:', currentAccount);
            }

            setAddress(currentAccount);
            setIsConnected(true);

            // Fetch balances
            const balances = await getBalances(currentAccount);
            setBalance(balances);

            localStorage.setItem(STORAGE_KEYS.WALLET_ADDRESS, currentAccount);
          }
        } catch (err) {
          console.error('❌ Auto-connect failed:', err);
        }
      }

      // Show warning if not MiniPay
      if (!miniPayDetected && window.ethereum) {
        console.warn('⚠️', ERROR_MESSAGES.NOT_MINIPAY);
      }
    };

    initialize();
  }, []); // Run once on mount

  // ============================================
  // EVENT LISTENER SETUP
  // ============================================

  useEffect(() => {
    // Setup event listeners
    onAccountsChanged(handleAccountsChanged);
    onChainChanged(handleChainChanged);
    onDisconnect(handleDisconnect);

    // Cleanup
    return () => {
      removeListener('accountsChanged', handleAccountsChanged as (...args: unknown[]) => void);
      removeListener('chainChanged', handleChainChanged as (...args: unknown[]) => void);
      removeListener('disconnect', handleDisconnect as (...args: unknown[]) => void);
    };
  }, [handleAccountsChanged, handleChainChanged, handleDisconnect]);

  // ============================================
  // BALANCE REFRESH INTERVAL
  // ============================================

  useEffect(() => {
    if (isConnected && address) {
      // Initial balance fetch
      refreshBalance();

      // Setup periodic refresh
      if (WALLET_CONFIG.REFRESH_BALANCE_INTERVAL > 0) {
        balanceIntervalRef.current = setInterval(
          refreshBalance,
          WALLET_CONFIG.REFRESH_BALANCE_INTERVAL
        );

        if (IS_DEBUG) {
          console.log(
            `⏰ Balance refresh interval set: ${WALLET_CONFIG.REFRESH_BALANCE_INTERVAL}ms`
          );
        }
      }
    }

    // Cleanup interval on disconnect
    return () => {
      if (balanceIntervalRef.current) {
        clearInterval(balanceIntervalRef.current);
        balanceIntervalRef.current = null;
      }
    };
  }, [isConnected, address, refreshBalance]);

  // ============================================
  // CLEANUP ON UNMOUNT
  // ============================================

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // ============================================
  // RETURN HOOK API
  // ============================================

  return {
    // State
    address,
    isConnected,
    isConnecting,
    isMiniPay,
    balance,
    error,

    // Functions
    connect,
    disconnect,
    refreshBalance,
  };
};

export default useWallet;
