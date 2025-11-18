// ============================================
// WALLET & WEB3 TYPES
// ============================================

export interface WalletState {
  address: `0x${string}` | null;
  isConnected: boolean;
  isConnecting: boolean;
  isMiniPay: boolean;
  balance: {
    cUSD: string;
    CELO: string;
  };
  error: string | null;
}

export interface ContractAddresses {
  scores: `0x${string}`;
  nft: `0x${string}`;
  cUSD: `0x${string}`;
}

// ============================================
// GAME TYPES
// ============================================

export interface GameState {
  isRunning: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  score: number;
  highScore: number;
}

export interface PlayerStats {
  bestScore: number;
  totalGames: number;
  rank: number;
  totalEarnings: string;
}

// ============================================
// LEADERBOARD TYPES
// ============================================

export interface ScoreEntry {
  player: `0x${string}`;
  playerName: string;
  score: bigint;
  timestamp: bigint;
  profileImageIPFS: string;
}

export interface LeaderboardEntry {
  rank: number;
  address: `0x${string}`;
  name: string;
  score: number;
  timestamp: number;
  profileImage: string;
}

// ============================================
// NFT TYPES
// ============================================

export interface ScoreNFT {
  tokenId: string;
  score: number;
  playerName: string;
  timestamp: number;
  tokenURI: string;
  imageURL: string;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string | number;
  }[];
}

// ============================================
// PROFILE PICTURE TYPES
// ============================================

export interface ProfilePicture {
  original: string;
  pixelated: string;
  cached: boolean;
}

// ============================================
// NETWORK TYPES
// ============================================

export type NetworkEnvironment = 'testnet' | 'mainnet';

export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  contracts: ContractAddresses;
}

// ============================================
// ERROR TYPES
// ============================================

export interface Web3Error {
  code: number;
  message: string;
  details?: string;
}

export type ErrorCode =
  | 'WALLET_NOT_FOUND'
  | 'NOT_MINIPAY'
  | 'CONNECTION_REJECTED'
  | 'NETWORK_ERROR'
  | 'CONTRACT_ERROR'
  | 'TRANSACTION_FAILED'
  | 'INSUFFICIENT_BALANCE'
  | 'UNKNOWN_ERROR';

// ============================================
// HOOK RETURN TYPES
// ============================================

export interface UseWalletReturn {
  // State
  address: `0x${string}` | null;
  isConnected: boolean;
  isConnecting: boolean;
  isMiniPay: boolean;
  balance: {
    cUSD: string;
    CELO: string;
  };
  error: string | null;

  // Functions
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
}
