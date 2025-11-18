'use client';

import { useState, useCallback } from 'react';
import { generateNFTImage, generateNFTMetadata, dataURLtoFile } from '@/utils/nftGenerator';
import { uploadToIPFS } from '@/utils/ipfsUpload';
import { mintScoreNFT, waitForTransaction } from '@/utils/contractInteraction';
import { STORAGE_KEYS } from '@/utils/constants';

export interface UseNFTMintingReturn {
  isMinting: boolean;
  error: string | null;
  txHash: string | null;
  mintNFT: (score: number, playerName: string, birdImage: string) => Promise<boolean>;
}

export const useNFTMinting = (): UseNFTMintingReturn => {
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const mintNFT = useCallback(
    async (score: number, playerName: string, birdImage: string): Promise<boolean> => {
      setIsMinting(true);
      setError(null);
      setTxHash(null);

      try {
        // Step 1: Generate NFT image
        console.log('🎨 Generating NFT image...');
        const timestamp = Date.now();
        const imageDataUrl = await generateNFTImage(score, playerName, birdImage, timestamp);

        // Step 2: Convert to file
        const imageFile = dataURLtoFile(imageDataUrl, `flappy-bird-${score}.png`);

        // Step 3: Generate metadata
        console.log('📝 Generating metadata...');
        const metadata = generateNFTMetadata(score, playerName, '', timestamp);

        // Step 4: Upload to IPFS
        console.log('☁️ Uploading to IPFS...');
        const ipfsResult = await uploadToIPFS(imageFile, metadata);

        // Step 5: Update metadata with image URL
        metadata.image = ipfsResult.imageUrl;

        // Step 6: Mint NFT
        console.log('⛏️ Minting NFT...');
        const hash = await mintScoreNFT(score, playerName, ipfsResult.metadataUrl);
        setTxHash(hash);

        // Step 7: Wait for confirmation
        console.log('⏳ Waiting for confirmation...');
        const success = await waitForTransaction(hash);

        if (success) {
          console.log('✅ NFT minted successfully!');

          // Store NFT info in localStorage
          const nftInfo = {
            score,
            playerName,
            timestamp,
            txHash: hash,
            metadataUrl: ipfsResult.metadataUrl,
            imageUrl: ipfsResult.imageUrl,
          };
          const existingNFTs = JSON.parse(
            localStorage.getItem('flappy_minted_nfts') || '[]'
          );
          existingNFTs.push(nftInfo);
          localStorage.setItem('flappy_minted_nfts', JSON.stringify(existingNFTs));

          return true;
        } else {
          throw new Error('Transaction failed');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to mint NFT';
        setError(message);
        console.error('❌ NFT minting failed:', err);
        return false;
      } finally {
        setIsMinting(false);
      }
    },
    []
  );

  return {
    isMinting,
    error,
    txHash,
    mintNFT,
  };
};
