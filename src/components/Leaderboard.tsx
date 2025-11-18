'use client';

import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useWallet } from '@/hooks/useWallet';
import { shortenAddress } from '@/utils/web3Client';

interface LeaderboardProps {
  onClose: () => void;
}

export const Leaderboard = ({ onClose }: LeaderboardProps) => {
  const { address } = useWallet();
  const { leaderboard, playerRank, isLoading, refresh } = useLeaderboard(address, 20);

  return (
    <div className="flex flex-col p-6 bg-gradient-to-b from-purple-600 to-purple-800 rounded-xl shadow-2xl max-w-2xl mx-auto max-h-[80vh] overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white drop-shadow">🏆 Leaderboard</h2>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all"
        >
          ✕ Close
        </button>
      </div>

      {/* Player Rank */}
      {address && playerRank > 0 && (
        <div className="mb-4 p-4 bg-yellow-400/20 border-2 border-yellow-400 rounded-lg">
          <p className="text-yellow-300 text-sm mb-1">Your Rank</p>
          <p className="text-yellow-400 text-3xl font-bold">#{playerRank}</p>
        </div>
      )}

      {/* Refresh Button */}
      <button
        onClick={refresh}
        disabled={isLoading}
        className="mb-4 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all disabled:opacity-50"
      >
        {isLoading ? '⏳ Loading...' : '🔄 Refresh'}
      </button>

      {/* Leaderboard List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {isLoading && leaderboard.length === 0 ? (
          <div className="text-center text-white/60 py-8">Loading leaderboard...</div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center text-white/60 py-8">
            No scores yet. Be the first to play!
          </div>
        ) : (
          leaderboard.map((entry) => (
            <div
              key={`${entry.address}-${entry.timestamp}`}
              className={`p-4 rounded-lg flex items-center justify-between ${
                entry.address === address
                  ? 'bg-yellow-400/30 border-2 border-yellow-400'
                  : 'bg-white/10 backdrop-blur-sm'
              }`}
            >
              {/* Rank */}
              <div className="flex items-center gap-4 flex-1">
                <div
                  className={`text-2xl font-bold ${
                    entry.rank === 1
                      ? 'text-yellow-400'
                      : entry.rank === 2
                      ? 'text-gray-300'
                      : entry.rank === 3
                      ? 'text-orange-400'
                      : 'text-white/70'
                  }`}
                >
                  {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                </div>

                {/* Player Info */}
                <div className="flex-1">
                  <p className="text-white font-semibold">
                    {entry.name || 'Anonymous'}
                    {entry.address === address && (
                      <span className="ml-2 text-xs text-yellow-300">(You)</span>
                    )}
                  </p>
                  <p className="text-white/60 text-xs">{shortenAddress(entry.address, 4)}</p>
                </div>

                {/* Score */}
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{entry.score}</p>
                  <p className="text-white/60 text-xs">
                    {new Date(entry.timestamp * 1000).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
