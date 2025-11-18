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
  const [playerName, setPlayerName] = useState('PLAYER1');
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
    <div className="retro-panel scanlines max-w-2xl mx-auto">
      {/* Game Over Title */}
      <div className="text-center mb-6">
        <div className="retro-panel bg-red-600 px-8 py-4 mb-4">
          <h2 className="pixel-text text-4xl" style={{ color: '#fff' }}>
            GAME OVER
          </h2>
        </div>

        {isNewHighScore && score > 0 && (
          <div className="blink mb-4">
            <div className="pixel-text text-xl" style={{ color: '#f7d51d' }}>
              ★ NEW HIGH SCORE! ★
            </div>
          </div>
        )}
      </div>

      {/* Final Score */}
      <div className="mb-6">
        <div className="retro-panel bg-black p-6">
          <p className="text-xs text-center mb-2" style={{ color: '#92cc41' }}>FINAL SCORE</p>
          <p className="retro-score text-center">{score.toString().padStart(6, '0')}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* High Score */}
        <div className="retro-panel bg-white p-4">
          <p className="text-xs mb-2" style={{ color: '#454545' }}>HIGH SCORE</p>
          <p className="pixel-text text-xl" style={{ color: '#212529' }}>
            {highScore.toString().padStart(6, '0')}
          </p>
        </div>

        {/* Rank */}
        {rank !== undefined && rank > 0 && (
          <div className="retro-panel bg-white p-4">
            <p className="text-xs mb-2" style={{ color: '#454545' }}>RANK</p>
            <p className="pixel-text text-xl" style={{ color: '#212529' }}>
              #{rank}
            </p>
          </div>
        )}

        {/* Reward */}
        <div className="retro-panel bg-white p-4 col-span-2">
          <p className="text-xs mb-2" style={{ color: '#454545' }}>REWARD</p>
          <p className="pixel-text text-xl" style={{ color: '#92cc41' }}>
            {reward.toFixed(4)} cUSD
          </p>
        </div>
      </div>

      {/* NFT Minting */}
      {canMint && !showNFTMinting && (
        <button
          onClick={() => setShowNFTMinting(true)}
          className="retro-btn retro-btn-blue w-full mb-3 text-sm"
        >
          🎨 MINT NFT
        </button>
      )}

      {showNFTMinting && birdImage && (
        <div className="mb-4">
          <NFTMinting
            score={score}
            playerName={playerName}
            birdImage={birdImage}
            onClose={() => setShowNFTMinting(false)}
          />
        </div>
      )}

      {/* Social Share */}
      <div className="mb-6">
        <SocialShare score={score} playerName={playerName} />
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={onRestart}
          className="retro-btn retro-btn-green w-full text-lg"
        >
          🔄 PLAY AGAIN
        </button>

        <button
          onClick={onViewLeaderboard}
          className="retro-btn w-full text-sm"
        >
          🏆 VIEW LEADERBOARD
        </button>
      </div>

      {/* Continue Prompt */}
      <div className="mt-6 text-center blink">
        <p className="text-xs" style={{ color: '#e76e55' }}>
          INSERT COIN TO CONTINUE
        </p>
      </div>
    </div>
  );
};
