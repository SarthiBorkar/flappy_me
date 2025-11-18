'use client';

import { useState, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useWallet } from '@/hooks/useWallet';
import { useProfilePicture } from '@/hooks/useProfilePicture';
import { StartScreen } from './StartScreen';
import { GameCanvas } from './GameCanvas';
import { GameHUD } from './GameHUD';
import { GameOverScreen } from './GameOverScreen';
import { Leaderboard } from './Leaderboard';
import { WalletStatus } from './WalletStatus';

type GameScreen = 'start' | 'playing' | 'gameover' | 'leaderboard';

export const GameContainer = () => {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('start');
  const [mounted, setMounted] = useState(false);

  const { gameState, highScore, startGame, pauseGame, resumeGame, handleJump, restartGame } =
    useGameState();
  const { address, balance, isConnected } = useWallet();
  const { profilePicture } = useProfilePicture();

  // Prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle game start
  const handleStart = () => {
    setCurrentScreen('playing');
    startGame();
  };

  // Handle game restart
  const handleRestart = () => {
    setCurrentScreen('playing');
    restartGame();
  };

  // Handle view leaderboard
  const handleViewLeaderboard = () => {
    setCurrentScreen('leaderboard');
  };

  // Handle close leaderboard
  const handleCloseLeaderboard = () => {
    setCurrentScreen('start');
  };

  // Detect when game ends
  useEffect(() => {
    if (gameState.isGameOver && currentScreen === 'playing') {
      setCurrentScreen('gameover');
    }
  }, [gameState.isGameOver, currentScreen]);

  // Show loading until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center scanlines" style={{ background: '#212529' }}>
        <div className="pixel-text text-white text-2xl blink">LOADING...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 scanlines" style={{ background: 'linear-gradient(to bottom, #209cee, #7038f8)' }}>
      {/* Retro Arcade Header */}
      <div className="mb-6 text-center">
        <div className="inline-block retro-panel bg-black px-8 py-4">
          <h1 className="pixel-text text-4xl" style={{ color: '#f7d51d' }}>
            🐦 FLAPPY BIRD 🐦
          </h1>
          <div className="text-xs mt-2" style={{ color: '#92cc41' }}>
            PLAYER 1
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="relative">
        {currentScreen === 'start' && (
          <StartScreen onStart={handleStart} highScore={highScore} />
        )}

        {currentScreen === 'playing' && (
          <div className="relative">
            <GameHUD
              score={gameState.score}
              balance={balance.cUSD}
              isPaused={gameState.isPaused}
              onPause={gameState.isPaused ? resumeGame : pauseGame}
            />
            <GameCanvas
              gameState={gameState}
              birdImage={profilePicture?.pixelated}
              onJump={handleJump}
            />
            {!gameState.isPaused && (
              <div className="mt-4 text-center">
                <div className="pixel-text text-white text-xs blink">
                  PRESS ANYWHERE!
                </div>
              </div>
            )}
          </div>
        )}

        {currentScreen === 'gameover' && (
          <GameOverScreen
            score={gameState.score}
            highScore={highScore}
            onRestart={handleRestart}
            onViewLeaderboard={handleViewLeaderboard}
            birdImage={profilePicture?.pixelated}
          />
        )}

        {currentScreen === 'leaderboard' && (
          <Leaderboard onClose={handleCloseLeaderboard} />
        )}
      </div>

      {/* Wallet Status (bottom) */}
      {currentScreen === 'start' && !isConnected && (
        <div className="mt-6 max-w-2xl w-full">
          <WalletStatus />
        </div>
      )}

      {/* Leaderboard Button */}
      {currentScreen === 'start' && isConnected && (
        <div className="mt-4 text-center">
          <button
            onClick={handleViewLeaderboard}
            className="retro-btn text-xs"
          >
            🏆 LEADERBOARD
          </button>
        </div>
      )}

      {/* Footer Credits */}
      <div className="mt-8 text-center">
        <div className="pixel-text text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
          © 2024 CELO × MINIPAY
        </div>
      </div>
    </div>
  );
};
