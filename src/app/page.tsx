'use client';

import { GameContainer } from '@/components/GameContainer';
import { CURRENT_NETWORK, IS_DEBUG } from '@/utils/constants';

export default function Home() {
  return (
    <main className="min-h-screen">
      <GameContainer />

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 text-center text-white/50 text-xs bg-gradient-to-t from-black/20 to-transparent">
        <p>
          Built with Next.js, Viem, and Celo • Network: {CURRENT_NETWORK.name}
          {IS_DEBUG && ' • Debug Mode'}
        </p>
        <p className="mt-1">
          Powered by{' '}
          <a
            href="https://minipay.opera.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white/70"
          >
            MiniPay
          </a>
        </p>
      </footer>
    </main>
  );
}
