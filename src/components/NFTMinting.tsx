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
    <div className="retro-panel bg-black p-6">
      <div className="retro-panel bg-purple-600 px-6 py-3 mb-4">
        <h3 className="pixel-text text-sm text-white text-center">
          🎨 MINT NFT
        </h3>
      </div>

      <div className="retro-panel bg-white p-4 mb-4">
        <p className="text-xs mb-3" style={{ color: '#454545' }}>NFT INCLUDES:</p>
        <div className="space-y-2 text-xs" style={{ color: '#212529' }}>
          <div>▶ SCORE: {score}</div>
          <div>▶ PLAYER: {playerName}</div>
          <div>▶ YOUR PIXELATED BIRD</div>
          <div>▶ CHAIN: {CURRENT_NETWORK.name}</div>
        </div>
      </div>

      {error && (
        <div className="retro-panel bg-red-600 p-3 mb-4">
          <p className="text-xs text-white">{error}</p>
        </div>
      )}

      {txHash && (
        <div className="retro-panel p-4 mb-4" style={{ background: '#92cc41' }}>
          <p className="pixel-text text-xs text-black mb-2">✅ MINTED!</p>
          <a
            href={`${CURRENT_NETWORK.blockExplorer}/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-black underline break-all"
          >
            VIEW ON EXPLORER
          </a>
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={handleMint}
          disabled={isMinting || !!txHash}
          className="retro-btn retro-btn-blue w-full text-sm"
        >
          {isMinting ? (
            <span className="blink">⏳ MINTING...</span>
          ) : txHash ? (
            '✅ MINTED!'
          ) : (
            '⛏️ MINT NFT'
          )}
        </button>

        {!isMinting && (
          <button
            onClick={onClose}
            className="retro-btn retro-btn-red w-full text-xs"
          >
            CANCEL
          </button>
        )}
      </div>

      {isMinting && (
        <p className="text-xs text-center mt-3 blink" style={{ color: '#92cc41' }}>
          PLEASE WAIT...
        </p>
      )}
    </div>
  );
};
