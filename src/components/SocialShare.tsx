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
    <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg">
      <p className="text-white/80 text-sm mb-3 text-center">Share Your Score</p>

      <div className="grid grid-cols-2 gap-2">
        {/* Twitter */}
        <a
          href={getTwitterShareUrl(score, playerName, nftUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-center transition-all flex items-center justify-center gap-2"
        >
          <span>🐦</span>
          <span className="text-sm font-semibold">Twitter</span>
        </a>

        {/* WhatsApp */}
        <a
          href={getWhatsAppShareUrl(score, playerName)}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-center transition-all flex items-center justify-center gap-2"
        >
          <span>💬</span>
          <span className="text-sm font-semibold">WhatsApp</span>
        </a>

        {/* Telegram */}
        <a
          href={getTelegramShareUrl(score, playerName)}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded-lg text-center transition-all flex items-center justify-center gap-2"
        >
          <span>✈️</span>
          <span className="text-sm font-semibold">Telegram</span>
        </a>

        {/* Copy Link */}
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-center transition-all flex items-center justify-center gap-2"
        >
          <span>{copied ? '✓' : '📋'}</span>
          <span className="text-sm font-semibold">{copied ? 'Copied!' : 'Copy Link'}</span>
        </button>
      </div>

      {/* Web Share API (if available) */}
      {typeof navigator !== 'undefined' && navigator.share && (
        <button
          onClick={handleWebShare}
          className="mt-2 w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all"
        >
          📤 Share...
        </button>
      )}
    </div>
  );
};
