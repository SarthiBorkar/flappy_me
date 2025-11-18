'use client';

import { useState, useEffect } from 'react';
import { calculateReward, canMintNFT } from '@/utils/gameEngine';
import { SocialShare } from './SocialShare';
import { NFTMinting } from './NFTMinting';
import { useWallet } from '@/hooks/useWallet';
import { STORAGE_KEYS } from '@/utils/constants';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  rank?: number;
  onRestart: () => void;
  onViewLeaderboard: () => void;
  birdImage?: string;
}

export const GameOverScreen = ({
  score,
  highScore,
  rank,
  onRestart,
  onViewLeaderboard,
  birdImage,
}: GameOverScreenProps) => {
  const { address } = useWallet();
  const [showNFTMinting, setShowNFTMinting] = useState(false);
  const [playerName, setPlayerName] = useState('Anonymous');
  const reward = calculateReward(score);
  const canMint = canMintNFT(score);
  const isNewHighScore = score >= highScore;

  useEffect(() => {
    // Load player name from localStorage
    const savedName = localStorage.getItem(STORAGE_KEYS.PLAYER_NAME);
    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-b from-red-500 to-red-700 rounded-xl shadow-2xl max-w-md mx-auto">
      {/* Game Over Title */}
      <h2 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
        Game Over!
      </h2>

      {isNewHighScore && score > 0 && (
        <div className="mb-4 px-4 py-2 bg-yellow-400 rounded-lg">
          <p className="text-gray-900 font-bold text-lg">🎉 New High Score!</p>
        </div>
      )}

      {/* Score Display */}
      <div className="mb-6 p-6 bg-white/20 backdrop-blur-sm rounded-lg border-4 border-white/40 w-full">
        <p className="text-white/80 text-center mb-2">Final Score</p>
        <p className="text-7xl font-bold text-white text-center drop-shadow-lg">{score}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6 w-full">
        {/* High Score */}
        <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg">
          <p className="text-white/70 text-xs mb-1">High Score</p>
          <p className="text-2xl font-bold text-yellow-300">{highScore}</p>
        </div>

        {/* Rank */}
        {rank !== undefined && rank > 0 && (
          <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg">
            <p className="text-white/70 text-xs mb-1">Global Rank</p>
            <p className="text-2xl font-bold text-yellow-300">#{rank}</p>
          </div>
        )}

        {/* Reward */}
        <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg col-span-2">
          <p className="text-white/70 text-xs mb-1">Earned</p>
          <p className="text-2xl font-bold text-green-300">{reward.toFixed(4)} cUSD</p>
        </div>
      </div>

      {/* NFT Minting */}
      {canMint && !showNFTMinting && (
        <button
          onClick={() => setShowNFTMinting(true)}
          className="w-full mb-3 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg shadow-lg transition-all"
        >
          🎨 Mint Score as NFT
        </button>
      )}

      {showNFTMinting && birdImage && (
        <div className="w-full mb-4">
          <NFTMinting
            score={score}
            playerName={playerName}
            birdImage={birdImage}
            onClose={() => setShowNFTMinting(false)}
          />
        </div>
      )}

      {/* Social Share */}
      <div className="w-full mb-6">
        <SocialShare score={score} playerName={playerName} />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 w-full">
        <button
          onClick={onRestart}
          className="px-6 py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-xl rounded-lg shadow-lg transition-all transform hover:scale-105"
        >
          🔄 Play Again
        </button>

        <button
          onClick={onViewLeaderboard}
          className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg transition-all"
        >
          🏆 View Leaderboard
        </button>
      </div>
    </div>
  );
};
