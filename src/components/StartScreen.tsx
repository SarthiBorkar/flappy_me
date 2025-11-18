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
    <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-b from-sky-400 to-sky-600 rounded-xl shadow-2xl max-w-md mx-auto">
      {/* Title */}
      <h1 className="text-6xl font-bold text-white mb-2 drop-shadow-lg">
        🐦 Flappy Bird
      </h1>
      <p className="text-xl text-white/90 mb-8">MiniPay Edition</p>

      {/* Profile Picture Preview */}
      {profilePicture && (
        <div className="mb-6">
          <p className="text-sm text-white/80 text-center mb-2">Your Bird:</p>
          <div className="relative">
            <img
              src={profilePicture.pixelated}
              alt="Your bird"
              className="w-20 h-20 pixel-art border-4 border-white rounded-lg shadow-lg"
            />
            <label className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 cursor-pointer shadow-lg hover:bg-gray-100">
              <span className="text-xl">📷</span>
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

      {/* High Score */}
      {highScore > 0 && (
        <div className="mb-6 p-4 bg-white/20 backdrop-blur-sm rounded-lg border-2 border-white/40">
          <p className="text-sm text-white/80 text-center">High Score</p>
          <p className="text-4xl font-bold text-yellow-300 text-center drop-shadow">
            {highScore}
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="mb-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
        <h3 className="text-white font-semibold mb-2 text-center">How to Play:</h3>
        <ul className="text-white/90 text-sm space-y-1">
          <li>• Tap or click to make the bird fly</li>
          <li>• Avoid hitting the pipes</li>
          <li>• Earn cUSD for your score</li>
          <li>• Mint high scores as NFTs!</li>
        </ul>
      </div>

      {/* Start Button */}
      {isConnected ? (
        <button
          onClick={onStart}
          className="px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-xl rounded-lg shadow-lg transition-all transform hover:scale-105 active:scale-95"
        >
          🎮 START GAME
        </button>
      ) : (
        <button
          onClick={connect}
          disabled={isConnecting}
          className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold text-xl rounded-lg shadow-lg transition-all transform hover:scale-105 disabled:opacity-50"
        >
          {isConnecting ? '⏳ Connecting...' : '👛 Connect Wallet'}
        </button>
      )}

      {!isConnected && (
        <p className="text-white/60 text-xs mt-4 text-center">
          Connect your MiniPay wallet to start playing
        </p>
      )}
    </div>
  );
};
