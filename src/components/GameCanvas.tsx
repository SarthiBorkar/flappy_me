'use client';

import { useRef, useEffect } from 'react';
import type { GameEngineState } from '@/utils/gameEngine';
import { GAME_CONFIG } from '@/utils/constants';

interface GameCanvasProps {
  gameState: GameEngineState;
  birdImage?: string;
  onJump: () => void;
}

export const GameCanvas = ({ gameState, birdImage, onJump }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const birdImageRef = useRef<HTMLImageElement | null>(null);

  // Load bird image
  useEffect(() => {
    if (birdImage) {
      const img = new Image();
      img.src = birdImage;
      img.onload = () => {
        birdImageRef.current = img;
      };
    }
  }, [birdImage]);

  // Handle click/tap
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleClick = () => {
      onJump();
    };

    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', handleClick);

    return () => {
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchstart', handleClick);
    };
  }, [onJump]);

  // Render game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);

    // Draw background (sky)
    const gradient = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.CANVAS_HEIGHT);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);

    // Draw pipes
    gameState.pipes.forEach((pipe) => {
      // Top pipe
      ctx.fillStyle = '#2ECC40';
      ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);

      // Top pipe border
      ctx.strokeStyle = '#1a7f26';
      ctx.lineWidth = 3;
      ctx.strokeRect(pipe.x, 0, pipe.width, pipe.topHeight);

      // Top pipe cap
      ctx.fillStyle = '#27AE60';
      ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, pipe.width + 10, 20);
      ctx.strokeRect(pipe.x - 5, pipe.topHeight - 20, pipe.width + 10, 20);

      // Bottom pipe
      ctx.fillStyle = '#2ECC40';
      ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, GAME_CONFIG.CANVAS_HEIGHT - pipe.bottomY);

      // Bottom pipe border
      ctx.strokeStyle = '#1a7f26';
      ctx.strokeRect(pipe.x, pipe.bottomY, pipe.width, GAME_CONFIG.CANVAS_HEIGHT - pipe.bottomY);

      // Bottom pipe cap
      ctx.fillStyle = '#27AE60';
      ctx.fillRect(pipe.x - 5, pipe.bottomY, pipe.width + 10, 20);
      ctx.strokeRect(pipe.x - 5, pipe.bottomY, pipe.width + 10, 20);
    });

    // Draw bird
    ctx.save();

    // Translate to bird position
    ctx.translate(
      gameState.bird.x + gameState.bird.size / 2,
      gameState.bird.y + gameState.bird.size / 2
    );

    // Rotate bird
    ctx.rotate((gameState.bird.rotation * Math.PI) / 180);

    // Draw bird image or circle
    if (birdImageRef.current) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        birdImageRef.current,
        -gameState.bird.size / 2,
        -gameState.bird.size / 2,
        gameState.bird.size,
        gameState.bird.size
      );
    } else {
      // Fallback: Draw yellow circle
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(0, 0, gameState.bird.size / 2, 0, Math.PI * 2);
      ctx.fill();

      // Eye
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(5, -5, 3, 0, Math.PI * 2);
      ctx.fill();

      // Beak
      ctx.fillStyle = '#FF8C00';
      ctx.beginPath();
      ctx.moveTo(gameState.bird.size / 2 - 5, 0);
      ctx.lineTo(gameState.bird.size / 2 + 5, -2);
      ctx.lineTo(gameState.bird.size / 2 - 5, 2);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();

    // Draw ground
    ctx.fillStyle = '#D2691E';
    ctx.fillRect(0, GAME_CONFIG.CANVAS_HEIGHT - 50, GAME_CONFIG.CANVAS_WIDTH, 50);

    // Ground grass
    ctx.fillStyle = '#8B4513';
    for (let i = 0; i < GAME_CONFIG.CANVAS_WIDTH; i += 20) {
      ctx.fillRect(i, GAME_CONFIG.CANVAS_HEIGHT - 50, 10, 5);
    }
  }, [gameState, birdImage]);

  return (
    <canvas
      ref={canvasRef}
      width={GAME_CONFIG.CANVAS_WIDTH}
      height={GAME_CONFIG.CANVAS_HEIGHT}
      className="border-4 border-white rounded-lg shadow-2xl cursor-pointer pixel-art"
      style={{
        touchAction: 'none',
        userSelect: 'none',
      }}
    />
  );
};
