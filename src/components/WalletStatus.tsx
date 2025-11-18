'use client';

import { useWallet } from '@/hooks/useWallet';
import { shortenAddress } from '@/utils/web3Client';
import { ERROR_MESSAGES, EXTERNAL_URLS } from '@/utils/constants';

/**
 * WalletStatus Component
 *
 * Displays wallet connection status and balance information
 * Demonstrates usage of the useWallet hook
 */
export const WalletStatus = () => {
  const {
    address,
    isConnected,
    isConnecting,
    isMiniPay,
    balance,
    error,
    connect,
    disconnect,
    refreshBalance,
  } = useWallet();

  // ============================================
  // RENDER: NOT IN BROWSER
  // ============================================

  if (typeof window === 'undefined') {
    return null;
  }

  // ============================================
  // RENDER: NO WALLET DETECTED
  // ============================================

  if (!window.ethereum) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          ❌ No Wallet Detected
        </h3>
        <p className="text-red-600 mb-4">{ERROR_MESSAGES.WALLET_NOT_FOUND}</p>
        <a
          href={EXTERNAL_URLS.MINIPAY_DOWNLOAD}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Download MiniPay
        </a>
      </div>
    );
  }

  // ============================================
  // RENDER: NOT MINIPAY WARNING
  // ============================================

  const showMiniPayWarning = !isMiniPay && !isConnected;

  // ============================================
  // RENDER: ERROR STATE
  // ============================================

  if (error && !isConnected) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          ⚠️ Connection Error
        </h3>
        <p className="text-yellow-700 mb-4">{error}</p>
        <button
          onClick={connect}
          disabled={isConnecting}
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
        >
          {isConnecting ? 'Connecting...' : 'Try Again'}
        </button>
      </div>
    );
  }

  // ============================================
  // RENDER: NOT CONNECTED
  // ============================================

  if (!isConnected) {
    return (
      <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
        {showMiniPayWarning && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
            <p className="text-sm text-yellow-800">
              ⚠️ {ERROR_MESSAGES.NOT_MINIPAY}
            </p>
          </div>
        )}

        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          {isMiniPay ? '🎮 Connect with MiniPay' : '👛 Connect Wallet'}
        </h3>
        <p className="text-blue-600 mb-4">
          Connect your wallet to start playing and earning cUSD rewards!
        </p>
        <button
          onClick={connect}
          disabled={isConnecting}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {isConnecting ? (
            <span className="flex items-center">
              <span className="animate-spin mr-2">⏳</span>
              Connecting...
            </span>
          ) : (
            'Connect Wallet'
          )}
        </button>
      </div>
    );
  }

  // ============================================
  // RENDER: CONNECTED
  // ============================================

  return (
    <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-green-800 mb-1">
            ✅ Wallet Connected
          </h3>
          {isMiniPay && (
            <span className="inline-block px-2 py-1 bg-green-200 text-green-800 text-xs rounded">
              MiniPay
            </span>
          )}
        </div>
        <button
          onClick={disconnect}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Disconnect
        </button>
      </div>

      {/* Address */}
      <div className="mb-4">
        <p className="text-sm text-green-700 mb-1">Address:</p>
        <code className="block p-2 bg-white rounded border border-green-300 text-sm font-mono">
          {address ? shortenAddress(address, 6) : 'N/A'}
        </code>
      </div>

      {/* Balances */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-white rounded border border-green-300">
          <p className="text-xs text-green-600 mb-1">cUSD Balance</p>
          <p className="text-lg font-semibold text-green-800">
            {parseFloat(balance.cUSD).toFixed(4)}
          </p>
        </div>
        <div className="p-3 bg-white rounded border border-green-300">
          <p className="text-xs text-green-600 mb-1">CELO Balance</p>
          <p className="text-lg font-semibold text-green-800">
            {parseFloat(balance.CELO).toFixed(4)}
          </p>
        </div>
      </div>

      {/* Refresh Button */}
      <button
        onClick={refreshBalance}
        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
      >
        🔄 Refresh Balance
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
};

export default WalletStatus;
