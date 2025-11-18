# 🤝 Contributing to Flappy Bird MiniPay Edition

Thank you for your interest in contributing! This document will help you get started.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Code Style](#code-style)
- [How to Contribute](#how-to-contribute)
- [Testing](#testing)
- [Deployment](#deployment)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- A Web3 wallet (MetaMask, MiniPay, etc.)
- Basic knowledge of:
  - React/Next.js
  - TypeScript
  - Web3/Blockchain (Celo)
  - Canvas API (for game rendering)

### Fork & Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/flappy_me.git
cd flappy_me
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 to see the app.

---

## 🏗️ Development Setup

### Environment Variables

Copy `.env.local` and update as needed:

```bash
# Network (testnet or mainnet)
NEXT_PUBLIC_NETWORK_ENV=testnet

# Contract addresses (update after deployment)
NEXT_PUBLIC_SCORES_CONTRACT_TESTNET=0x...
NEXT_PUBLIC_NFT_CONTRACT_TESTNET=0x...

# Game configuration
NEXT_PUBLIC_REWARD_RATE=0.01
NEXT_PUBLIC_MIN_SCORE_FOR_NFT=100
```

### Testing with MiniPay (Mobile)

#### Option 1: Using ngrok

```bash
npx ngrok http 3000
# Open the ngrok URL in MiniPay browser
```

#### Option 2: Same WiFi Network

```bash
# Find your IP address (Mac: System Settings → Network)
# Open http://YOUR_IP:3000 in MiniPay
```

### Smart Contract Development (Optional)

Only needed if you're working on blockchain features:

```bash
# Install Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts --legacy-peer-deps

# Compile contracts
npx hardhat compile

# Deploy to testnet
npx hardhat run scripts/deploy.ts --network alfajores
```

---

## 📁 Project Structure

```
flappy_me/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── page.tsx            # Main page
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   │
│   ├── components/             # React components
│   │   ├── GameContainer.tsx   # Main game orchestrator
│   │   ├── StartScreen.tsx     # Game start screen
│   │   ├── GameCanvas.tsx      # Canvas rendering
│   │   ├── GameHUD.tsx         # In-game HUD
│   │   ├── GameOverScreen.tsx  # Game over screen
│   │   ├── Leaderboard.tsx     # Leaderboard display
│   │   ├── NFTMinting.tsx      # NFT minting UI
│   │   ├── SocialShare.tsx     # Social sharing
│   │   └── WalletStatus.tsx    # Wallet connection UI
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useWallet.ts        # Wallet state management
│   │   ├── useGameState.ts     # Game loop & state
│   │   ├── useProfilePicture.ts# Profile picture handling
│   │   ├── useNFTMinting.ts    # NFT minting logic
│   │   └── useLeaderboard.ts   # Leaderboard fetching
│   │
│   ├── utils/                  # Utility functions
│   │   ├── web3Client.ts       # Viem client setup
│   │   ├── constants.ts        # Configuration
│   │   ├── gameEngine.ts       # Game physics
│   │   ├── collisionDetection.ts # Collision logic
│   │   ├── contractInteraction.ts# Smart contract calls
│   │   ├── imageProcessor.ts   # Pixelation
│   │   ├── nftGenerator.ts     # NFT generation
│   │   └── socialShare.ts      # Share URLs
│   │
│   ├── types/
│   │   └── index.ts            # TypeScript definitions
│   │
│   └── contracts/
│       └── abis.ts             # Contract ABIs
│
├── contracts/                  # Smart contracts
│   ├── FlappyBirdScores.sol    # Leaderboard contract
│   └── FlappyBirdNFT.sol       # NFT contract
│
└── scripts/
    └── deploy.ts               # Deployment script
```

---

## 💅 Code Style

### TypeScript

- Use TypeScript for all new files
- Define interfaces for all props and state
- Use `const` for immutable values
- Use descriptive variable names

**Example:**

```typescript
interface GameCanvasProps {
  gameState: GameEngineState;
  birdImage?: string;
  onJump: () => void;
}

export const GameCanvas = ({ gameState, birdImage, onJump }: GameCanvasProps) => {
  // Component logic
};
```

### React Components

- Use functional components with hooks
- Mark client components with `'use client'`
- Handle hydration errors with `useState` + `useEffect`
- Use descriptive component names

**Example:**

```typescript
'use client';

import { useState, useEffect } from 'react';

export const MyComponent = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div>Loading...</div>;

  return <div>Content</div>;
};
```

### Styling

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use consistent spacing (p-4, p-6, mb-4, etc.)
- Use semantic color names

**Example:**

```tsx
<button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all">
  Click Me
</button>
```

### File Organization

- One component per file
- Export component as default
- Group related functions together
- Add JSDoc comments for complex functions

**Example:**

```typescript
/**
 * Calculate reward based on score
 * @param score Player's final score
 * @returns Reward amount in cUSD
 */
export const calculateReward = (score: number): number => {
  return score * GAME_CONFIG.REWARD_RATE;
};
```

---

## 🔧 How to Contribute

### 1. Choose an Issue

- Check [Issues](https://github.com/yourusername/flappy_me/issues) for open tasks
- Look for `good first issue` or `help wanted` labels
- Comment on the issue to let others know you're working on it

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming:
- `feature/` for new features
- `fix/` for bug fixes
- `docs/` for documentation
- `refactor/` for code refactoring

### 3. Make Your Changes

- Write clean, readable code
- Follow the code style guide
- Add comments for complex logic
- Test your changes thoroughly

### 4. Test Locally

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

### 5. Commit Your Changes

Follow conventional commits:

```bash
git add .
git commit -m "feat: add new feature"
# or
git commit -m "fix: resolve hydration error"
```

Commit types:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

### 6. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear title describing the change
- Description of what was changed and why
- Screenshots (if UI changes)
- Link to related issue

---

## 🧪 Testing

### Manual Testing Checklist

Before submitting a PR, test:

- [ ] Game starts and runs smoothly
- [ ] Wallet connection works
- [ ] Profile picture upload and pixelation works
- [ ] Collision detection is accurate
- [ ] Score tracking is correct
- [ ] UI is responsive on mobile and desktop
- [ ] No console errors
- [ ] No hydration errors

### Test with Different Wallets

- [ ] MetaMask (desktop)
- [ ] MiniPay (mobile)
- [ ] Other Web3 wallets

### Test on Different Browsers

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

### Browser Console

Check for:
- No red errors
- No hydration warnings
- Proper wallet detection logs

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

1. Push to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy!

### Deploy Smart Contracts

```bash
# Deploy to testnet
npx hardhat run scripts/deploy.ts --network alfajores

# Update .env.local with new addresses
NEXT_PUBLIC_SCORES_CONTRACT_TESTNET=0x...
NEXT_PUBLIC_NFT_CONTRACT_TESTNET=0x...
```

---

## 📝 Areas to Contribute

### Game Features

- [ ] Sound effects
- [ ] Particle effects on collision
- [ ] Different difficulty levels
- [ ] Power-ups
- [ ] Different bird skins
- [ ] Multiplayer mode

### Blockchain Features

- [ ] Staking mechanism
- [ ] Token rewards
- [ ] Achievement NFTs
- [ ] Tournament mode
- [ ] Governance voting

### UI/UX Improvements

- [ ] Dark mode
- [ ] Accessibility features
- [ ] Better animations
- [ ] Loading screens
- [ ] Tutorial mode

### Technical Improvements

- [ ] Add unit tests
- [ ] Add E2E tests
- [ ] Improve performance
- [ ] Add error boundaries
- [ ] Optimize bundle size

### Documentation

- [ ] API documentation
- [ ] Tutorial videos
- [ ] Blog posts
- [ ] Translations

---

## 🤔 Questions?

- Check existing [Issues](https://github.com/yourusername/flappy_me/issues)
- Review [README.md](README.md) and [QUICK_START.md](QUICK_START.md)
- Open a new issue for questions

---

## 📜 Code of Conduct

- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Follow best practices
- Have fun! 🎮

---

## 🙏 Thank You!

Every contribution, no matter how small, is valuable and appreciated!

**Happy coding! 🚀**
