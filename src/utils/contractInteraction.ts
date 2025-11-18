import type { Address } from 'viem';
import { getPublicClient, getWalletClient, estimateGasWithFeeCurrency } from './web3Client';
import {
  SCORES_CONTRACT_ADDRESS,
  NFT_CONTRACT_ADDRESS,
  IS_DEBUG,
} from './constants';
import { FlappyBirdScoresABI, FlappyBirdNFTABI } from '@/contracts/abis';
import type { ScoreEntry, LeaderboardEntry } from '@/types';

// ============================================
// SCORES CONTRACT INTERACTIONS
// ============================================

/**
 * Submit score to leaderboard contract
 */
export const submitScore = async (
  score: number,
  playerName: string,
  profileImageIPFS: string = ''
): Promise<`0x${string}`> => {
  try {
    const walletClient = getWalletClient();
    if (!walletClient) {
      throw new Error('Wallet client not available');
    }

    const [address] = await walletClient.getAddresses();

    if (IS_DEBUG) {
      console.log('📝 Submitting score:', { score, playerName, address });
    }

    // Estimate gas
    const gas = await estimateGasWithFeeCurrency({
      account: address,
      to: SCORES_CONTRACT_ADDRESS,
      data: undefined,
    });

    // Write to contract
    const hash = await walletClient.writeContract({
      address: SCORES_CONTRACT_ADDRESS,
      abi: FlappyBirdScoresABI,
      functionName: 'submitScore',
      args: [BigInt(score), playerName, profileImageIPFS],
      account: address,
      gas,
    });

    if (IS_DEBUG) {
      console.log('✅ Score submitted:', hash);
    }

    return hash;
  } catch (error) {
    console.error('❌ Failed to submit score:', error);
    throw error;
  }
};

/**
 * Get leaderboard from contract
 */
export const getLeaderboard = async (limit: number = 10): Promise<LeaderboardEntry[]> => {
  try {
    const publicClient = getPublicClient();

    const scores = (await publicClient.readContract({
      address: SCORES_CONTRACT_ADDRESS,
      abi: FlappyBirdScoresABI,
      functionName: 'getLeaderboard',
      args: [BigInt(limit)],
    })) as ScoreEntry[];

    // Transform to LeaderboardEntry
    const leaderboard: LeaderboardEntry[] = scores.map((entry, index) => ({
      rank: index + 1,
      address: entry.player,
      name: entry.playerName,
      score: Number(entry.score),
      timestamp: Number(entry.timestamp),
      profileImage: entry.profileImageIPFS,
    }));

    if (IS_DEBUG) {
      console.log('📊 Leaderboard fetched:', leaderboard);
    }

    return leaderboard;
  } catch (error) {
    console.error('❌ Failed to get leaderboard:', error);
    return [];
  }
};

/**
 * Get player rank
 */
export const getPlayerRank = async (playerAddress: Address): Promise<number> => {
  try {
    const publicClient = getPublicClient();

    const rank = (await publicClient.readContract({
      address: SCORES_CONTRACT_ADDRESS,
      abi: FlappyBirdScoresABI,
      functionName: 'getPlayerRank',
      args: [playerAddress],
    })) as bigint;

    return Number(rank);
  } catch (error) {
    console.error('❌ Failed to get player rank:', error);
    return 0;
  }
};

/**
 * Get player stats
 */
export const getPlayerStats = async (
  playerAddress: Address
): Promise<{ bestScore: number; totalScores: number }> => {
  try {
    const publicClient = getPublicClient();

    const stats = (await publicClient.readContract({
      address: SCORES_CONTRACT_ADDRESS,
      abi: FlappyBirdScoresABI,
      functionName: 'getPlayerStats',
      args: [playerAddress],
    })) as [bigint, bigint];

    return {
      bestScore: Number(stats[0]),
      totalScores: Number(stats[1]),
    };
  } catch (error) {
    console.error('❌ Failed to get player stats:', error);
    return { bestScore: 0, totalScores: 0 };
  }
};

// ============================================
// NFT CONTRACT INTERACTIONS
// ============================================

/**
 * Mint score NFT
 */
export const mintScoreNFT = async (
  score: number,
  playerName: string,
  tokenURI: string
): Promise<`0x${string}`> => {
  try {
    const walletClient = getWalletClient();
    if (!walletClient) {
      throw new Error('Wallet client not available');
    }

    const [address] = await walletClient.getAddresses();

    if (IS_DEBUG) {
      console.log('🎨 Minting NFT:', { score, playerName, tokenURI });
    }

    // Estimate gas
    const gas = await estimateGasWithFeeCurrency({
      account: address,
      to: NFT_CONTRACT_ADDRESS,
      data: undefined,
    });

    // Write to contract
    const hash = await walletClient.writeContract({
      address: NFT_CONTRACT_ADDRESS,
      abi: FlappyBirdNFTABI,
      functionName: 'mintScoreNFT',
      args: [address, BigInt(score), playerName, tokenURI],
      account: address,
      gas,
    });

    if (IS_DEBUG) {
      console.log('✅ NFT minted:', hash);
    }

    return hash;
  } catch (error) {
    console.error('❌ Failed to mint NFT:', error);
    throw error;
  }
};

/**
 * Get NFT balance for address
 */
export const getNFTBalance = async (address: Address): Promise<number> => {
  try {
    const publicClient = getPublicClient();

    const balance = (await publicClient.readContract({
      address: NFT_CONTRACT_ADDRESS,
      abi: FlappyBirdNFTABI,
      functionName: 'balanceOf',
      args: [address],
    })) as bigint;

    return Number(balance);
  } catch (error) {
    console.error('❌ Failed to get NFT balance:', error);
    return 0;
  }
};

/**
 * Get token URI
 */
export const getTokenURI = async (tokenId: number): Promise<string> => {
  try {
    const publicClient = getPublicClient();

    const uri = (await publicClient.readContract({
      address: NFT_CONTRACT_ADDRESS,
      abi: FlappyBirdNFTABI,
      functionName: 'tokenURI',
      args: [BigInt(tokenId)],
    })) as string;

    return uri;
  } catch (error) {
    console.error('❌ Failed to get token URI:', error);
    return '';
  }
};

// ============================================
// TRANSACTION HELPERS
// ============================================

/**
 * Wait for transaction confirmation
 */
export const waitForTransaction = async (
  hash: `0x${string}`
): Promise<boolean> => {
  try {
    const publicClient = getPublicClient();

    const receipt = await publicClient.waitForTransactionReceipt({
      hash,
      confirmations: 1,
    });

    const success = receipt.status === 'success';

    if (IS_DEBUG) {
      console.log('📜 Transaction receipt:', { hash, success });
    }

    return success;
  } catch (error) {
    console.error('❌ Transaction wait failed:', error);
    return false;
  }
};
