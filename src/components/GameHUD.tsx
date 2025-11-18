'use client';

import { GAME_CONFIG } from '@/utils/constants';
import { calculateSpeed } from '@/utils/gameEngine';

interface GameHUDProps {
  score: number;
  rank?: number;
  balance?: string;
  isPaused?: boolean;
  onPause?: () => void;
}

export const GameHUD = ({ score, rank, balance, isPaused, onPause }: GameHUDProps) => {
  const currentSpeed = calculateSpeed(score);
  const speedPercent = Math.round((currentSpeed / GAME_CONFIG.PIPE_SPEED_MAX) * 100);
  return (
    <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-start pointer-events-none z-10">
      {/* Score Display */}
      <div className="retro-panel bg-black px-6 py-3 pointer-events-auto">
        <div className="text-xs mb-1" style={{ color: '#f7d51d' }}>SCORE</div>
        <div className="pixel-text text-3xl" style={{ color: '#fff' }}>
          {score.toString().padStart(6, '0')}
        </div>
      </div>

      {/* Info Panel */}
      <div className="space-y-2">
        {/* Speed Indicator */}
        <div className="retro-panel bg-black px-4 py-2 pointer-events-auto">
          <div className="text-xs mb-1" style={{ color: '#f7d51d' }}>
            SPEED
          </div>
          <div className="pixel-text text-xs" style={{ color: speedPercent >= 80 ? '#e76e55' : '#92cc41' }}>
            {speedPercent}%
          </div>
        </div>

        {/* Balance */}
        {balance && (
          <div className="retro-panel bg-black px-4 py-2 pointer-events-auto">
            <div className="text-xs" style={{ color: '#92cc41' }}>
              💰 {parseFloat(balance).toFixed(2)}
            </div>
          </div>
        )}

        {/* Rank */}
        {rank !== undefined && rank > 0 && (
          <div className="retro-panel bg-black px-4 py-2 pointer-events-auto">
            <div className="text-xs" style={{ color: '#f7d51d' }}>
              🏆 #{rank}
            </div>
          </div>
        )}

        {/* Pause button */}
        {onPause && (
          <button
            onClick={onPause}
            className="retro-btn retro-btn-red text-xs px-3 py-2 pointer-events-auto"
          >
            {isPaused ? '▶' : '⏸'}
          </button>
        )}
      </div>
    </div>
  );
};
