/**
 * Smart Contract ABIs
 */

// ============================================
// FLAPPY BIRD SCORES CONTRACT ABI
// ============================================

export const FlappyBirdScoresABI = [
  {
    type: 'function',
    name: 'submitScore',
    stateMutability: 'nonpayable',
    inputs: [
      { name: '_score', type: 'uint256' },
      { name: '_playerName', type: 'string' },
      { name: '_profileImageIPFS', type: 'string' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'getLeaderboard',
    stateMutability: 'view',
    inputs: [{ name: '_limit', type: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        components: [
          { name: 'player', type: 'address' },
          { name: 'playerName', type: 'string' },
          { name: 'score', type: 'uint256' },
          { name: 'timestamp', type: 'uint256' },
          { name: 'profileImageIPFS', type: 'string' },
        ],
      },
    ],
  },
  {
    type: 'function',
    name: 'getPlayerRank',
    stateMutability: 'view',
    inputs: [{ name: '_player', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'getPlayerStats',
    stateMutability: 'view',
    inputs: [{ name: '_player', type: 'address' }],
    outputs: [
      { name: 'bestScore', type: 'uint256' },
      { name: 'totalScores', type: 'uint256' },
    ],
  },
  {
    type: 'function',
    name: 'playerBestScore',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'event',
    name: 'ScoreSubmitted',
    inputs: [
      { name: 'player', type: 'address', indexed: true },
      { name: 'score', type: 'uint256', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
] as const;

// ============================================
// FLAPPY BIRD NFT CONTRACT ABI
// ============================================

export const FlappyBirdNFTABI = [
  {
    type: 'function',
    name: 'mintScoreNFT',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'score', type: 'uint256' },
      { name: 'playerName', type: 'string' },
      { name: 'tokenURI', type: 'string' },
    ],
    outputs: [{ name: 'tokenId', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'tokenURI',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'ownerOf',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    type: 'event',
    name: 'ScoreNFTMinted',
    inputs: [
      { name: 'to', type: 'address', indexed: true },
      { name: 'tokenId', type: 'uint256', indexed: false },
      { name: 'score', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'Transfer',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'tokenId', type: 'uint256', indexed: true },
    ],
  },
] as const;
