'use client';

import { useWallet } from '@/hooks/useWallet';
import { useProfilePicture } from '@/hooks/useProfilePicture';

interface StartScreenProps {
  onStart: () => void;
  highScore: number;
}

export const StartScreen = ({ onStart, highScore }: StartScreenProps) => {
  const { isConnected, connect, isConnecting } = useWallet();
  const { profilePicture, uploadPicture } = useProfilePicture();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await uploadPicture(file);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  return (
    <div className="retro-panel scanlines max-w-2xl mx-auto">
      {/* Retro Title */}
      <div className="text-center mb-8">
        <div className="mb-4">
          <h1 className="pixel-text text-6xl mb-2" style={{ color: '#f7d51d' }}>
            FLAPPY
          </h1>
          <h1 className="pixel-text text-6xl mb-4" style={{ color: '#e52521' }}>
            BIRD
          </h1>
          <div className="blink text-sm" style={{ color: '#454545' }}>
            ★ MINIPAY EDITION ★
          </div>
        </div>
      </div>

      {/* Profile Picture Preview */}
      {profilePicture && (
        <div className="mb-6 text-center">
          <p className="text-xs mb-3" style={{ color: '#454545' }}>YOUR BIRD:</p>
          <div className="relative inline-block">
            <div className="gameboy-box p-4">
              <img
                src={profilePicture.pixelated}
                alt="Your bird"
                className="w-24 h-24 pixel-art mx-auto"
              />
            </div>
            <label className="absolute -bottom-2 -right-2 retro-btn retro-btn-blue cursor-pointer text-xs px-3 py-2">
              <span>📷</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}

      {/* High Score Box */}
      {highScore > 0 && (
        <div className="mb-6">
          <div className="retro-panel bg-black p-6">
            <p className="text-xs mb-2 text-center" style={{ color: '#f7d51d' }}>★ HIGH SCORE ★</p>
            <p className="retro-score text-center">{highScore.toString().padStart(6, '0')}</p>
          </div>
        </div>
      )}

      {/* Instructions Box */}
      <div className="mb-6">
        <div className="retro-panel bg-white border-4 border-black p-6">
          <h3 className="text-center mb-4 text-xs" style={{ color: '#454545' }}>
            ═══ HOW TO PLAY ═══
          </h3>
          <div className="space-y-3 text-xs" style={{ color: '#212529' }}>
            <div className="flex items-start">
              <span className="mr-3">▶</span>
              <span>TAP TO FLY</span>
            </div>
            <div className="flex items-start">
              <span className="mr-3">▶</span>
              <span>AVOID PIPES</span>
            </div>
            <div className="flex items-start">
              <span className="mr-3">▶</span>
              <span>EARN cUSD</span>
            </div>
            <div className="flex items-start">
              <span className="mr-3">▶</span>
              <span>MINT NFTs!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Start/Connect Button */}
      <div className="text-center">
        {isConnected ? (
          <button
            onClick={onStart}
            className="retro-btn retro-btn-green w-full text-lg"
          >
            ▶ START GAME ◀
          </button>
        ) : (
          <div>
            <button
              onClick={connect}
              disabled={isConnecting}
              className="retro-btn retro-btn-blue w-full text-sm mb-3"
            >
              {isConnecting ? '⏳ CONNECTING...' : '🔗 CONNECT WALLET'}
            </button>
            <p className="text-xs" style={{ color: '#454545' }}>
              PRESS TO CONNECT
            </p>
          </div>
        )}
      </div>

      {/* Press Start */}
      {isConnected && (
        <div className="mt-6 text-center blink">
          <p className="text-xs" style={{ color: '#e76e55' }}>
            PRESS START TO BEGIN
          </p>
        </div>
      )}
    </div>
  );
};
