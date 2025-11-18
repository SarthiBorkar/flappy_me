import { celo, celoAlfajores } from 'viem/chains';
import type { NetworkConfig, NetworkEnvironment } from '@/types';

// ============================================
// ENVIRONMENT CONFIGURATION
// ============================================

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_DEBUG = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';

export const NETWORK_ENV: NetworkEnvironment =
  (process.env.NEXT_PUBLIC_NETWORK_ENV as NetworkEnvironment) || 'testnet';

// ============================================
// NETWORK CONFIGURATION
// ============================================

export const CELO_CHAINS = {
  mainnet: celo,
  testnet: celoAlfajores,
};

export const NETWORK_CONFIG: Record<NetworkEnvironment, NetworkConfig> = {
  testnet: {
    chainId: celoAlfajores.id,
    name: 'Celo Alfajores Testnet',
    rpcUrl: process.env.NEXT_PUBLIC_CELO_RPC_TESTNET || 'https://alfajores-forno.celo-testnet.org',
    blockExplorer: 'https://alfajores.celoscan.io',
    contracts: {
      scores: (process.env.NEXT_PUBLIC_SCORES_CONTRACT_TESTNET as `0x${string}`) || '0x0000000000000000000000000000000000000000',
      nft: (process.env.NEXT_PUBLIC_NFT_CONTRACT_TESTNET as `0x${string}`) || '0x0000000000000000000000000000000000000000',
      cUSD: (process.env.NEXT_PUBLIC_CUSD_CONTRACT_TESTNET as `0x${string}`) || '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
    },
  },
  mainnet: {
    chainId: celo.id,
    name: 'Celo Mainnet',
    rpcUrl: process.env.NEXT_PUBLIC_CELO_RPC_MAINNET || 'https://forno.celo.org',
    blockExplorer: 'https://celoscan.io',
    contracts: {
      scores: (process.env.NEXT_PUBLIC_SCORES_CONTRACT_MAINNET as `0x${string}`) || '0x0000000000000000000000000000000000000000',
      nft: (process.env.NEXT_PUBLIC_NFT_CONTRACT_MAINNET as `0x${string}`) || '0x0000000000000000000000000000000000000000',
      cUSD: (process.env.NEXT_PUBLIC_CUSD_CONTRACT_MAINNET as `0x${string}`) || '0x765DE816845861e75A25fCA122bb6898B8B1282a',
    },
  },
};

export const CURRENT_NETWORK = NETWORK_CONFIG[NETWORK_ENV];
export const CURRENT_CHAIN = CELO_CHAINS[NETWORK_ENV];

// ============================================
// CONTRACT ADDRESSES
// ============================================

export const SCORES_CONTRACT_ADDRESS = CURRENT_NETWORK.contracts.scores;
export const NFT_CONTRACT_ADDRESS = CURRENT_NETWORK.contracts.nft;
export const CUSD_CONTRACT_ADDRESS = CURRENT_NETWORK.contracts.cUSD;

// ============================================
// GAME CONFIGURATION
// ============================================

export const GAME_CONFIG = {
  // Physics
  GRAVITY: 0.6,
  JUMP_VELOCITY: -10,
  MAX_VELOCITY: 15,
  PIPE_SPEED: 3,
  PIPE_GAP: 150,
  PIPE_WIDTH: 80,

  // Bird
  BIRD_SIZE: 40,
  BIRD_X_POSITION: 100,

  // Canvas
  CANVAS_WIDTH: 400,
  CANVAS_HEIGHT: 600,

  // Scoring
  REWARD_RATE: parseFloat(process.env.NEXT_PUBLIC_REWARD_RATE || '0.01'),
  MIN_SCORE_FOR_NFT: parseInt(process.env.NEXT_PUBLIC_MIN_SCORE_FOR_NFT || '100', 10),

  // Features
  NFT_MINTING_ENABLED: process.env.NEXT_PUBLIC_NFT_MINTING_ENABLED === 'true',
  LEADERBOARD_ENABLED: process.env.NEXT_PUBLIC_LEADERBOARD_ENABLED === 'true',
  SOCIAL_SHARING_ENABLED: process.env.NEXT_PUBLIC_SOCIAL_SHARING_ENABLED === 'true',
};

// ============================================
// WALLET CONFIGURATION
// ============================================

export const WALLET_CONFIG = {
  AUTO_CONNECT: true,
  REFRESH_BALANCE_INTERVAL: 30000, // 30 seconds
  MINIPAY_USER_AGENT_KEYWORDS: ['MiniPay', 'Opera Mini'],
};

// ============================================
// ERROR MESSAGES
// ============================================

export const ERROR_MESSAGES = {
  WALLET_NOT_FOUND: 'No wallet detected. Please install MiniPay or a compatible wallet.',
  NOT_MINIPAY: 'This app is optimized for MiniPay. Some features may not work correctly.',
  CONNECTION_REJECTED: 'Wallet connection was rejected. Please try again.',
  NETWORK_ERROR: 'Failed to connect to Celo network. Please check your connection.',
  WRONG_NETWORK: `Please switch to ${CURRENT_NETWORK.name}.`,
  CONTRACT_ERROR: 'Failed to interact with smart contract.',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  INSUFFICIENT_BALANCE: 'Insufficient balance to complete this transaction.',
  PROFILE_PICTURE_ERROR: 'Failed to load profile picture.',
  NFT_MINT_ERROR: 'Failed to mint NFT. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
};

// ============================================
// API ENDPOINTS
// ============================================

export const API_ENDPOINTS = {
  GENERATE_NFT: '/api/generateNFT',
  FETCH_PROFILE_PICTURE: '/api/fetchProfilePicture',
  HEALTH: '/api/health',
};

// ============================================
// STORAGE KEYS
// ============================================

export const STORAGE_KEYS = {
  WALLET_ADDRESS: 'flappy_wallet_address',
  HIGH_SCORE: 'flappy_high_score',
  PROFILE_PICTURE: 'flappy_profile_picture',
  PLAYER_NAME: 'flappy_player_name',
  SETTINGS: 'flappy_settings',
};

// ============================================
// EXTERNAL URLS
// ============================================

export const EXTERNAL_URLS = {
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  MINIPAY_DOWNLOAD: 'https://minipay.opera.com',
  CELO_DOCS: 'https://docs.celo.org',
  TWITTER_INTENT: 'https://twitter.com/intent/tweet',
  GITHUB: 'https://github.com/yourusername/flappy_me',
};

// ============================================
// ANIMATION / UI CONFIGURATION
// ============================================

export const UI_CONFIG = {
  TOAST_DURATION: 3000,
  LOADING_MIN_DISPLAY: 500,
  CONFETTI_DURATION: 3000,
  ANIMATION_DURATION: 300,
};
