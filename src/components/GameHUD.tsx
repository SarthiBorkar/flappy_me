'use client';

interface GameHUDProps {
  score: number;
  rank?: number;
  balance?: string;
  isPaused?: boolean;
  onPause?: () => void;
}

export const GameHUD = ({ score, rank, balance, isPaused, onPause }: GameHUDProps) => {
  return (
    <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-none">
      {/* Score */}
      <div className="bg-black/50 backdrop-blur-sm px-6 py-3 rounded-lg border-2 border-white/40">
        <p className="text-white/80 text-xs mb-1">SCORE</p>
        <p className="text-white text-4xl font-bold drop-shadow-lg">{score}</p>
      </div>

      {/* Info Panel */}
      <div className="space-y-2">
        {rank !== undefined && rank > 0 && (
          <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-yellow-400/60">
            <p className="text-yellow-300 text-xs mb-1">RANK</p>
            <p className="text-yellow-400 text-xl font-bold">#{rank}</p>
          </div>
        )}

        {balance && (
          <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-green-400/60">
            <p className="text-green-300 text-xs mb-1">cUSD</p>
            <p className="text-green-400 text-xl font-bold">
              {parseFloat(balance).toFixed(2)}
            </p>
          </div>
        )}

        {/* Pause button */}
        {onPause && (
          <button
            onClick={onPause}
            className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-white/40 text-white hover:bg-black/70 pointer-events-auto"
          >
            {isPaused ? '▶️' : '⏸️'}
          </button>
        )}
      </div>
    </div>
  );
};
