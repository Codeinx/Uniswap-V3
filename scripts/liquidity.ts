import { ethers } from "hardhat";
import { Token, CurrencyAmount, Percent, Fetcher, Position, NonfungiblePositionManager } from "@uniswap/v3-sdk";

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Using account:", signer.address);

  const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

  const USDC = new Token(1, USDC_ADDRESS, 6, "USDC", "USD Coin");
  const WETH = new Token(1, WETH_ADDRESS, 18, "WETH", "Wrapped Ether");

  const FEE = 3000;

  const pool = await Fetcher.fetchPoolData(USDC, WETH, FEE, signer.provider);

  const usdcAmount = CurrencyAmount.fromRawAmount(USDC, 100 * 10 ** 6);
  const wethAmount = CurrencyAmount.fromRawAmount(WETH, ethers.utils.parseEther("0.1").toString());

  const position = new Position({
    pool,
    liquidity: usdcAmount.add(wethAmount),
    tickLower: pool.tickCurrent - 60, 
    tickUpper: pool.tickCurrent + 60, 
  });

  const nfPositionManager = new NonfungiblePositionManager({ provider: signer.provider, signer });
  await nfPositionManager.approve(USDC_ADDRESS, usdcAmount.raw);
  await nfPositionManager.approve(WETH_ADDRESS, wethAmount.raw);

  const tx = await nfPositionManager.mint({
    token0: USDC_ADDRESS,
    token1: WETH_ADDRESS,
    fee: FEE,
    tickLower: position.tickLower,
    tickUpper: position.tickUpper,
    amount0Desired: usdcAmount.raw,
    amount1Desired: wethAmount.raw,
    amount0Min: 0,
    amount1Min: 0,
    recipient: signer.address,
    deadline: Math.floor(Date.now() / 1000) + 60 * 10,
  });

  console.log("Transaction sent:", tx.hash);
  await tx.wait();
  console.log("Liquidity added successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });