# 🚀 Quick Start Guide

## Your Game is LIVE! 🎉

**URL**: http://localhost:3000

## What Works Right Now

### ✅ Fully Functional
- **Game Engine**: Complete physics, gravity, collision detection
- **Canvas Rendering**: Smooth 60 FPS gameplay
- **Controls**: Click or tap to jump
- **Profile Picture**: Upload and pixelate your own image to use as the bird
- **Score Tracking**: High scores saved locally
- **Wallet Connection**: MiniPay detection and connection
- **UI/UX**: Complete start screen, game HUD, game over screen
- **Social Sharing**: Share buttons for Twitter, WhatsApp, Telegram

### ⏳ Requires Smart Contract Deployment
- **On-chain Leaderboard**: View global rankings
- **NFT Minting**: Mint your high scores as NFTs
- **Blockchain Score Submission**: Submit scores to Celo blockchain

## How to Play (Desktop)

1. **Open Browser**: Navigate to http://localhost:3000
2. **Connect Wallet** (Optional): Click "Connect Wallet" or skip for now
3. **Upload Profile Picture** (Optional): Click the camera icon to upload your image
4. **Start Game**: Click "START GAME"
5. **Play**: Click anywhere to make the bird jump
6. **Avoid Pipes**: Don't hit the pipes or ground
7. **Score Points**: Pass through pipes to increase score
8. **Game Over**: View your score and play again

## How to Play (Mobile - MiniPay)

### Option 1: Using ngrok (Recommended)
```bash
# In a new terminal window
npx ngrok http 3000
```
Then open the ngrok URL in MiniPay browser.

### Option 2: Same WiFi Network
1. Find your computer's IP address:
   - Mac: System Settings → Network
   - Your IP will be something like `192.168.1.xxx`
2. Open in MiniPay: `http://YOUR_IP:3000`

## Game Controls

- **Desktop**: Click anywhere to jump
- **Mobile**: Tap anywhere to jump
- **Pause**: Click the pause button in top-right during game

## Tips for Best Experience

1. **Profile Picture**:
   - Upload a square image for best results
   - The image will be pixelated automatically
   - Fallback: Default yellow bird if no image

2. **High Scores**:
   - Saved in your browser's localStorage
   - Persists across sessions
   - Viewable on start screen

3. **Wallet Connection**:
   - Works with MiniPay and other Web3 wallets
   - Shows your cUSD and CELO balance
   - Optional - game works without wallet

## Customization

### Change Game Physics
Edit `src/utils/constants.ts`:
```typescript
export const GAME_CONFIG = {
  GRAVITY: 0.6,        // Lower = floatier
  JUMP_VELOCITY: -10,  // Higher = bigger jump
  MAX_VELOCITY: 15,    // Terminal velocity
  PIPE_SPEED: 3,       // Pipe movement speed
  PIPE_GAP: 150,       // Gap between pipes
};
```

### Change Reward Rate
Edit `.env.local`:
```bash
NEXT_PUBLIC_REWARD_RATE=0.01  # cUSD per point
NEXT_PUBLIC_MIN_SCORE_FOR_NFT=100  # Min score to mint
```

## Troubleshooting

### Game Won't Load
- Check that server is running: `npm run dev`
- Clear browser cache and reload
- Check console for errors (F12 → Console)

### Bird Appears as Yellow Circle
- Upload a profile picture using the camera icon
- Or: Image failed to load, check console for errors

### Wallet Won't Connect
- Make sure you're using a Web3 wallet (MiniPay, MetaMask, etc.)
- Check that wallet is on correct network
- Try refreshing the page

### Canvas Not Rendering
- Make sure browser supports Canvas API (all modern browsers do)
- Try a different browser
- Check if hardware acceleration is enabled

## Next Steps

### Deploy Smart Contracts (Optional)
See `HARDHAT_SETUP.md` for instructions on deploying contracts to Celo.

Once contracts are deployed:
1. Update `.env.local` with contract addresses
2. Restart the dev server
3. All blockchain features will work!

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel/Netlify
1. Push to GitHub
2. Connect to Vercel/Netlify
3. Deploy!
4. Share your game with the world

## Keyboard Shortcuts (Development)

- **Ctrl+C** in terminal: Stop server
- **F12**: Open browser DevTools
- **Ctrl+Shift+R**: Hard refresh (clear cache)

## File Structure Quick Reference

```
src/
├── app/page.tsx           # Main page
├── components/            # UI components
│   └── GameContainer.tsx  # Main game logic
├── hooks/                 # React hooks
│   ├── useGameState.ts    # Game state & loop
│   └── useWallet.ts       # Wallet connection
└── utils/
    ├── gameEngine.ts      # Physics & logic
    └── constants.ts       # Configuration
```

## Support

- **README.md**: Full documentation
- **IMPLEMENTATION_COMPLETE.md**: Technical details
- **HARDHAT_SETUP.md**: Smart contract deployment

---

**Have fun playing! 🎮**

Report any issues by checking the browser console (F12).
