'use client';

import { useNFTMinting } from '@/hooks/useNFTMinting';
import { CURRENT_NETWORK } from '@/utils/constants';

interface NFTMintingProps {
  score: number;
  playerName: string;
  birdImage: string;
  onClose: () => void;
}

export const NFTMinting = ({ score, playerName, birdImage, onClose }: NFTMintingProps) => {
  const { isMinting, error, txHash, mintNFT } = useNFTMinting();

  const handleMint = async () => {
    const success = await mintNFT(score, playerName, birdImage);
    if (success) {
      // Show success message for a bit before closing
      setTimeout(() => {
        onClose();
      }, 3000);
    }
  };

  return (
    <div className="p-6 bg-purple-900/90 backdrop-blur-sm rounded-lg border-2 border-purple-400">
      <h3 className="text-white font-bold text-xl mb-4 text-center">
        🎨 Mint Your Score as NFT
      </h3>

      <div className="mb-4 p-4 bg-white/10 rounded-lg">
        <p className="text-white/80 text-sm mb-2">This will create an NFT with:</p>
        <ul className="text-white text-sm space-y-1">
          <li>• Score: {score}</li>
          <li>• Player: {playerName}</li>
          <li>• Your pixelated bird</li>
          <li>• Minted on {CURRENT_NETWORK.name}</li>
        </ul>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-400 rounded-lg">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      {txHash && (
        <div className="mb-4 p-3 bg-green-500/20 border border-green-400 rounded-lg">
          <p className="text-green-200 text-sm mb-1">✅ NFT Minted Successfully!</p>
          <a
            href={`${CURRENT_NETWORK.blockExplorer}/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-300 text-xs underline break-all"
          >
            View on Explorer
          </a>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleMint}
          disabled={isMinting || !!txHash}
          className="flex-1 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isMinting ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin mr-2">⏳</span>
              Minting...
            </span>
          ) : txHash ? (
            '✅ Minted!'
          ) : (
            '⛏️ Mint NFT'
          )}
        </button>

        {!isMinting && (
          <button
            onClick={onClose}
            className="px-4 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all"
          >
            Cancel
          </button>
        )}
      </div>

      {isMinting && (
        <p className="text-white/60 text-xs text-center mt-2">
          This may take a few moments...
        </p>
      )}
    </div>
  );
};
