'use client';

import { useState } from 'react';
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
  const { gameState, highScore, startGame, pauseGame, resumeGame, handleJump, restartGame } =
    useGameState();
  const { address, balance, isConnected } = useWallet();
  const { profilePicture } = useProfilePicture();

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
  if (gameState.isGameOver && currentScreen === 'playing') {
    setCurrentScreen('gameover');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-sky-400 to-sky-600">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-5xl font-bold text-white text-center drop-shadow-lg">
          🐦 Flappy Bird
        </h1>
        <p className="text-white/80 text-center">MiniPay Edition</p>
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

      {/* Footer Info */}
      {currentScreen === 'start' && !isConnected && (
        <div className="mt-6 max-w-md">
          <WalletStatus />
        </div>
      )}

      {currentScreen === 'start' && isConnected && (
        <div className="mt-4 text-center">
          <button
            onClick={handleViewLeaderboard}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all"
          >
            🏆 View Leaderboard
          </button>
        </div>
      )}

      {/* Instructions for playing screen */}
      {currentScreen === 'playing' && !gameState.isPaused && (
        <div className="mt-4 text-white/80 text-center text-sm">
          <p>Tap or click to fly!</p>
        </div>
      )}
    </div>
  );
};
