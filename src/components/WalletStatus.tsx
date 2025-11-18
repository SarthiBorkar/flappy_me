'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { shortenAddress } from '@/utils/web3Client';
import { ERROR_MESSAGES, EXTERNAL_URLS } from '@/utils/constants';

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

  const [mounted, setMounted] = useState(false);
  const [hasWallet, setHasWallet] = useState(false);

  // Only run on client-side to prevent hydration errors
  useEffect(() => {
    setMounted(true);
    setHasWallet(typeof window !== 'undefined' && !!window.ethereum);
  }, []);

  // Don't render anything until mounted (prevents hydration errors)
  if (!mounted) {
    return (
      <div className="retro-panel max-w-2xl mx-auto">
        <div className="text-center blink pixel-text text-sm">
          LOADING...
        </div>
      </div>
    );
  }

  // No wallet detected
  if (!hasWallet) {
    return (
      <div className="retro-panel max-w-2xl mx-auto">
        <div className="retro-panel bg-red-600 px-6 py-3 mb-4">
          <h3 className="pixel-text text-sm text-white text-center">
            ❌ NO WALLET
          </h3>
        </div>
        <p className="text-xs mb-4 text-center" style={{ color: '#454545' }}>
          {ERROR_MESSAGES.WALLET_NOT_FOUND}
        </p>
        <a
          href={EXTERNAL_URLS.MINIPAY_DOWNLOAD}
          target="_blank"
          rel="noopener noreferrer"
          className="retro-btn retro-btn-red w-full text-sm"
        >
          GET MINIPAY
        </a>
      </div>
    );
  }

  // Error state
  if (error && !isConnected) {
    return (
      <div className="retro-panel max-w-2xl mx-auto">
        <div className="retro-panel bg-yellow-500 px-6 py-3 mb-4">
          <h3 className="pixel-text text-sm text-black text-center">
            ⚠️ ERROR
          </h3>
        </div>
        <p className="text-xs mb-4 text-center" style={{ color: '#454545' }}>
          {error}
        </p>
        <button
          onClick={connect}
          disabled={isConnecting}
          className="retro-btn w-full text-sm"
        >
          {isConnecting ? 'CONNECTING...' : 'TRY AGAIN'}
        </button>
      </div>
    );
  }

  // Not connected
  if (!isConnected) {
    const showMiniPayWarning = !isMiniPay;

    return (
      <div className="retro-panel max-w-2xl mx-auto">
        {showMiniPayWarning && (
          <div className="retro-panel bg-yellow-500 p-4 mb-4">
            <p className="text-xs text-black">
              ⚠️ {ERROR_MESSAGES.NOT_MINIPAY}
            </p>
          </div>
        )}

        <div className="text-center mb-4">
          <h3 className="pixel-text text-xl mb-2" style={{ color: '#212529' }}>
            {isMiniPay ? '🎮 MINIPAY' : '👛 WALLET'}
          </h3>
          <p className="text-xs" style={{ color: '#454545' }}>
            CONNECT TO START
          </p>
        </div>

        <button
          onClick={() => {
            console.log('🔘 Connect button clicked');
            connect();
          }}
          disabled={isConnecting}
          className="retro-btn retro-btn-blue w-full text-sm"
        >
          {isConnecting ? (
            <span className="blink">CONNECTING...</span>
          ) : (
            '🔗 CONNECT'
          )}
        </button>
      </div>
    );
  }

  // Connected
  return (
    <div className="retro-panel max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="pixel-text text-sm" style={{ color: '#92cc41' }}>
            ✅ CONNECTED
          </div>
          {isMiniPay && (
            <div className="text-xs mt-1" style={{ color: '#454545' }}>
              MINIPAY
            </div>
          )}
        </div>
        <button
          onClick={disconnect}
          className="retro-btn retro-btn-red text-xs px-3 py-2"
        >
          ✕
        </button>
      </div>

      {/* Address */}
      <div className="mb-4">
        <p className="text-xs mb-2" style={{ color: '#454545' }}>ADDRESS:</p>
        <div className="retro-panel bg-white p-3">
          <code className="text-xs" style={{ color: '#212529' }}>
            {address ? shortenAddress(address, 6) : 'N/A'}
          </code>
        </div>
      </div>

      {/* Balances */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="retro-panel bg-white p-3">
          <p className="text-xs mb-1" style={{ color: '#454545' }}>cUSD</p>
          <p className="pixel-text text-sm" style={{ color: '#92cc41' }}>
            {parseFloat(balance.cUSD).toFixed(4)}
          </p>
        </div>
        <div className="retro-panel bg-white p-3">
          <p className="text-xs mb-1" style={{ color: '#454545' }}>CELO</p>
          <p className="pixel-text text-sm" style={{ color: '#209cee' }}>
            {parseFloat(balance.CELO).toFixed(4)}
          </p>
        </div>
      </div>

      {/* Refresh Button */}
      <button
        onClick={refreshBalance}
        className="retro-btn w-full text-xs"
      >
        🔄 REFRESH
      </button>
    </div>
  );
};

export default WalletStatus;
