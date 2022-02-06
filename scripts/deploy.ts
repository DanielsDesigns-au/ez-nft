// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  const EzNFTMarket = await ethers.getContractFactory("EzNFTMarket");
  const ezNFTMarket = await EzNFTMarket.deploy();
  await ezNFTMarket.deployed();
  console.log("ezNFTMarket Deployed to:", ezNFTMarket.address);

  const EzNFT = await ethers.getContractFactory("EzNFT");
  const ezNFT = await EzNFT.deploy();
  await ezNFT.deployed();
  console.log("ezNFT Deployed to:", ezNFT.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
