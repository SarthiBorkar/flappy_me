'use client';

import { useState } from 'react';
import {
  getTwitterShareUrl,
  getWhatsAppShareUrl,
  getTelegramShareUrl,
  shareViaWebAPI,
  copyShareLink,
} from '@/utils/socialShare';

interface SocialShareProps {
  score: number;
  playerName: string;
  nftUrl?: string;
}

export const SocialShare = ({ score, playerName, nftUrl }: SocialShareProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyShareLink(score, playerName);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWebShare = async () => {
    await shareViaWebAPI(score, playerName);
  };

  return (
    <div className="retro-panel bg-black p-4">
      <p className="pixel-text text-xs mb-4 text-center" style={{ color: '#f7d51d' }}>
        ★ SHARE SCORE ★
      </p>

      <div className="grid grid-cols-2 gap-3">
        {/* Twitter */}
        <a
          href={getTwitterShareUrl(score, playerName, nftUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className="retro-btn retro-btn-blue text-xs px-3 py-2 text-center"
        >
          🐦 TWITTER
        </a>

        {/* WhatsApp */}
        <a
          href={getWhatsAppShareUrl(score, playerName)}
          target="_blank"
          rel="noopener noreferrer"
          className="retro-btn retro-btn-green text-xs px-3 py-2 text-center"
        >
          💬 WHATSAPP
        </a>

        {/* Telegram */}
        <a
          href={getTelegramShareUrl(score, playerName)}
          target="_blank"
          rel="noopener noreferrer"
          className="retro-btn retro-btn-blue text-xs px-3 py-2 text-center"
        >
          ✈️ TELEGRAM
        </a>

        {/* Copy Link */}
        <button
          onClick={handleCopy}
          className="retro-btn text-xs px-3 py-2"
        >
          {copied ? '✓ COPIED!' : '📋 COPY'}
        </button>
      </div>

      {/* Web Share API (if available) */}
      {typeof navigator !== 'undefined' && navigator.share && (
        <button
          onClick={handleWebShare}
          className="retro-btn w-full text-xs mt-3"
        >
          📤 SHARE...
        </button>
      )}
    </div>
  );
};
