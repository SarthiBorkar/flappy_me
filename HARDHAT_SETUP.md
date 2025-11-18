# 🔧 Hardhat Setup for Smart Contract Deployment

The main game works without Hardhat! Hardhat is only needed if you want to deploy the smart contracts.

## When to Install Hardhat

You only need Hardhat if you want to:
- Deploy the smart contracts to Celo
- Test contracts locally
- Verify contracts on block explorer

## How to Install Hardhat (When Ready)

Run this command to install Hardhat and contract dependencies:

```bash
npm install --save-dev hardhat@2.26.0 @nomicfoundation/hardhat-toolbox@5.0.0 @openzeppelin/contracts@5.1.0 dotenv@16.4.5 --legacy-peer-deps
```

## Deploy Smart Contracts

Once Hardhat is installed:

```bash
# 1. Add your private key to .env.local
echo "PRIVATE_KEY=your_private_key_here" >> .env.local

# 2. Compile contracts
npx hardhat compile

# 3. Deploy to Celo Alfajores Testnet
npx hardhat run scripts/deploy.ts --network alfajores

# 4. Update .env.local with deployed addresses
# The deployment script will output the contract addresses
```

## Without Smart Contracts

The game still works without deploying contracts! These features work:
- ✅ Full game engine and physics
- ✅ Canvas rendering
- ✅ Wallet connection (MiniPay)
- ✅ Profile picture pixelation
- ✅ Score tracking (localStorage)
- ✅ High scores

These features require deployed contracts:
- ❌ On-chain leaderboard
- ❌ NFT minting
- ❌ Blockchain score submission

## Test the Game NOW

The game is playable right now at:
```
http://localhost:3000
```

Just:
1. Open http://localhost:3000
2. Click through wallet connection
3. Play the game!

The smart contracts can be deployed later when you're ready.
