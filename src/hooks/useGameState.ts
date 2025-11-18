'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  initializeGameState,
  updateGameState,
  resetGame,
  type GameEngineState,
} from '@/utils/gameEngine';
import { STORAGE_KEYS } from '@/utils/constants';

export interface UseGameStateReturn {
  gameState: GameEngineState;
  highScore: number;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  handleJump: () => void;
  restartGame: () => void;
  isPlaying: boolean;
}

export const useGameState = (): UseGameStateReturn => {
  const [gameState, setGameState] = useState<GameEngineState>(initializeGameState());
  const [highScore, setHighScore] = useState(0);
  const gameLoopRef = useRef<number | null>(null);

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem(STORAGE_KEYS.HIGH_SCORE);
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Update high score when game ends
  useEffect(() => {
    if (gameState.isGameOver && gameState.score > highScore) {
      setHighScore(gameState.score);
      localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, gameState.score.toString());
    }
  }, [gameState.isGameOver, gameState.score, highScore]);

  // Game loop
  const gameLoop = useCallback(() => {
    setGameState((prevState) => {
      const newState = updateGameState(prevState);

      // Stop loop if game over
      if (newState.isGameOver && gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }

      return newState;
    });

    // Continue loop
    if (gameLoopRef.current !== null) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  }, []);

  const startGame = useCallback(() => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }

    const newState = resetGame();
    setGameState(newState);
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameLoop]);

  const pauseGame = useCallback(() => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }

    setGameState((prevState) => updateGameState(prevState, 'pause'));
  }, []);

  const resumeGame = useCallback(() => {
    setGameState((prevState) => updateGameState(prevState, 'resume'));

    if (!gameLoopRef.current) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  }, [gameLoop]);

  const handleJump = useCallback(() => {
    if (gameState.isGameOver || gameState.isPaused) {
      return;
    }

    setGameState((prevState) => updateGameState(prevState, 'jump'));
  }, [gameState.isGameOver, gameState.isPaused]);

  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, []);

  return {
    gameState,
    highScore,
    startGame,
    pauseGame,
    resumeGame,
    handleJump,
    restartGame,
    isPlaying: gameState.isRunning && !gameState.isPaused,
  };
};
