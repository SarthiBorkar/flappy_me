import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying Flappy Bird contracts to Celo...\n");

  // Get deployer
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
  console.log("");

  // Deploy FlappyBirdScores
  console.log("📝 Deploying FlappyBirdScores...");
  const FlappyBirdScores = await ethers.getContractFactory("FlappyBirdScores");
  const scores = await FlappyBirdScores.deploy();
  await scores.deployed();
  console.log("✅ FlappyBirdScores deployed to:", scores.address);
  console.log("");

  // Deploy FlappyBirdNFT
  console.log("🎨 Deploying FlappyBirdNFT...");
  const FlappyBirdNFT = await ethers.getContractFactory("FlappyBirdNFT");
  const nft = await FlappyBirdNFT.deploy();
  await nft.deployed();
  console.log("✅ FlappyBirdNFT deployed to:", nft.address);
  console.log("");

  // Print summary
  console.log("=" .repeat(60));
  console.log("DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("FlappyBirdScores:", scores.address);
  console.log("FlappyBirdNFT:   ", nft.address);
  console.log("=".repeat(60));
  console.log("");
  console.log("📋 Update your .env.local with these addresses:");
  console.log(`NEXT_PUBLIC_SCORES_CONTRACT_TESTNET=${scores.address}`);
  console.log(`NEXT_PUBLIC_NFT_CONTRACT_TESTNET=${nft.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
