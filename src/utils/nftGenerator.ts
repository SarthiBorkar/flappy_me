import type { NFTMetadata } from '@/types';
import { CURRENT_NETWORK } from './constants';

/**
 * Generate NFT image for score
 */
export const generateNFTImage = async (
  score: number,
  playerName: string,
  birdImage: string,
  timestamp: number
): Promise<string> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Set canvas size
  canvas.width = 500;
  canvas.height = 500;

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 500);
  gradient.addColorStop(0, '#4F46E5');
  gradient.addColorStop(1, '#7C3AED');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 500, 500);

  // Border
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 10;
  ctx.strokeRect(10, 10, 480, 480);

  // Title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('🐦 FLAPPY BIRD', 250, 60);

  // Score box
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fillRect(100, 100, 300, 120);
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 3;
  ctx.strokeRect(100, 100, 300, 120);

  // Score label
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 24px Arial';
  ctx.fillText('SCORE', 250, 135);

  // Score value
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 64px Arial';
  ctx.fillText(score.toString(), 250, 195);

  // Bird image
  if (birdImage) {
    try {
      const img = new Image();
      img.src = birdImage;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(175, 240, 150, 150);
      ctx.strokeStyle = '#FFFFFF';
      ctx.strokeRect(175, 240, 150, 150);
      ctx.drawImage(img, 185, 250, 130, 130);
    } catch (error) {
      console.error('Failed to load bird image:', error);
    }
  }

  // Player name
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 20px Arial';
  ctx.fillText(playerName || 'Anonymous', 250, 420);

  // Date
  const date = new Date(timestamp);
  ctx.fillStyle = '#E0E0E0';
  ctx.font = '16px Arial';
  ctx.fillText(date.toLocaleDateString(), 250, 445);

  // Chain info
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 14px Arial';
  ctx.fillText(`⛓️ ${CURRENT_NETWORK.name}`, 250, 470);

  // Return as data URL
  return canvas.toDataURL('image/png');
};

/**
 * Generate NFT metadata
 */
export const generateNFTMetadata = (
  score: number,
  playerName: string,
  imageUrl: string,
  timestamp: number
): NFTMetadata => {
  return {
    name: `Flappy Bird Score: ${score}`,
    description: `${playerName} achieved a score of ${score} in Flappy Bird on ${new Date(
      timestamp
    ).toLocaleDateString()}. Minted on ${CURRENT_NETWORK.name}.`,
    image: imageUrl,
    attributes: [
      {
        trait_type: 'Score',
        value: score,
      },
      {
        trait_type: 'Player',
        value: playerName,
      },
      {
        trait_type: 'Date',
        value: new Date(timestamp).toISOString(),
      },
      {
        trait_type: 'Network',
        value: CURRENT_NETWORK.name,
      },
      {
        trait_type: 'Game',
        value: 'Flappy Bird',
      },
    ],
  };
};

/**
 * Convert data URL to File
 */
export const dataURLtoFile = (dataUrl: string, filename: string): File => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};
