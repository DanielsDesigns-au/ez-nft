import { ethers } from "hardhat";
import { expect } from "chai";

describe("NFTMarket", function () {
  it("Should create and execute market sales", async function () {
    const Market = await ethers.getContractFactory("EzNFTMarket");
    const market = await Market.deploy();
    await market.deployed();
    const marketAddress = market.address

    const NFT = await ethers.getContractFactory("EzNFT");
    const nft = await NFT.deploy(marketAddress);
    await nft.deployed();
    const nftContractAddress = nft.address;

    let listingPrice = await market.getListingPrice();
    listingPrice = listingPrice.toString();
    const auctionPrice = ethers.utils.parseUnits('100', 'ether');

    await nft.createToken("https://www.mytokenlocation.com");
    await nft.createToken("https://www.mytokenlocation2.com");

    await market.createMarketNFT(nftContractAddress, 1, auctionPrice, {value: listingPrice});
    await market.createMarketNFT(nftContractAddress, 2, auctionPrice, {value: listingPrice});

    // Helper function for testing to generate as many signers as you want
    const [_, buyerAddress] = await ethers.getSigners();

    await market.connect(buyerAddress).sellMarketNFT(nftContractAddress, 1, {value: auctionPrice});

    const items = await market.getMarketNFTs();
    console.log(`items: ${items}`);
  });
});
