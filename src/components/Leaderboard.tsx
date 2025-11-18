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
    <div className="retro-panel scanlines max-w-2xl mx-auto max-h-[80vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="retro-panel bg-black px-6 py-3">
          <h2 className="pixel-text text-xl" style={{ color: '#f7d51d' }}>
            🏆 LEADERBOARD
          </h2>
        </div>
        <button
          onClick={onClose}
          className="retro-btn retro-btn-red text-xs px-4 py-2"
        >
          ✕
        </button>
      </div>

      {/* Player Rank */}
      {address && playerRank > 0 && (
        <div className="retro-panel bg-black p-4 mb-4" style={{ borderColor: '#f7d51d' }}>
          <p className="text-xs mb-2" style={{ color: '#f7d51d' }}>YOUR RANK</p>
          <p className="pixel-text text-3xl" style={{ color: '#f7d51d' }}>#{playerRank}</p>
        </div>
      )}

      {/* Refresh Button */}
      <button
        onClick={refresh}
        disabled={isLoading}
        className="retro-btn w-full text-xs mb-4"
      >
        {isLoading ? <span className="blink">⏳ LOADING...</span> : '🔄 REFRESH'}
      </button>

      {/* Leaderboard List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {isLoading && leaderboard.length === 0 ? (
          <div className="retro-panel bg-white p-8 text-center">
            <p className="pixel-text text-sm blink" style={{ color: '#454545' }}>
              LOADING...
            </p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="retro-panel bg-white p-8 text-center">
            <p className="text-xs" style={{ color: '#454545' }}>
              NO SCORES YET!<br/>BE THE FIRST TO PLAY!
            </p>
          </div>
        ) : (
          leaderboard.map((entry) => (
            <div
              key={`${entry.address}-${entry.timestamp}`}
              className={`retro-panel p-4 flex items-center justify-between ${
                entry.address === address
                  ? 'bg-yellow-300'
                  : 'bg-white'
              }`}
            >
              {/* Rank */}
              <div className="flex items-center gap-4 flex-1">
                <div
                  className={`pixel-text text-xl ${
                    entry.rank === 1
                      ? ''
                      : entry.rank === 2
                      ? ''
                      : entry.rank === 3
                      ? ''
                      : ''
                  }`}
                  style={{
                    color: entry.rank === 1
                      ? '#f7d51d'
                      : entry.rank === 2
                      ? '#c0c0c0'
                      : entry.rank === 3
                      ? '#cd7f32'
                      : '#454545'
                  }}
                >
                  {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                </div>

                {/* Player Info */}
                <div className="flex-1">
                  <p className="text-xs font-bold" style={{ color: '#212529' }}>
                    {entry.name || 'ANONYMOUS'}
                    {entry.address === address && (
                      <span className="ml-2" style={{ color: '#f7d51d' }}>(YOU)</span>
                    )}
                  </p>
                  <p className="text-xs" style={{ color: '#454545' }}>
                    {shortenAddress(entry.address, 4)}
                  </p>
                </div>

                {/* Score */}
                <div className="text-right">
                  <p className="pixel-text text-lg" style={{ color: '#92cc41' }}>
                    {entry.score}
                  </p>
                  <p className="text-xs" style={{ color: '#454545' }}>
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
