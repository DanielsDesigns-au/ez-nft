import { Dispatch, SetStateAction } from "react";
import { nftAddress, nftMarketAddress } from "@config";

import Market from "@artifacts/contracts/EzNFTMarket.sol/EzNFTMarket.json";
import NFT from "@artifacts/contracts/EzNFT.sol/EzNFT.json";
import Web3Modal from "web3modal";
import axios from "axios";
import { ethers } from "ethers";

export const getUnsoldNFTs = async () => {
  /* create a generic provider and query for unsold market items */
  const provider = new ethers.providers.JsonRpcProvider();
  const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
  const marketContract = new ethers.Contract(
    nftMarketAddress,
    Market.abi,
    provider
  );
  const data = await marketContract.getMarketNFTs();

  /*
   *  map over items returned from smart contract and format
   *  them as well as fetch their token metadata
   */
  const items = await Promise.all(
    data.map(async (i: any, index: number) => {
      const price = await ethers.utils.formatUnits(i.price.toString(), "ether");

      try {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        // Even though it says await has no impact, it does!
        const item = await {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
          keyProp: `nftIndex-${i.tokenId}`,
        };
        return item;
      } catch (error) {
        // Even though it says await has no impact, it does!
        const item = await {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: "Unknown",
          name: "Unknown",
          description: "Unknown",
          keyProp: `nftIndex-${i.tokenId}`,
        };
        return item;
      }
    })
  );
  return items;
};

export const buyNft = async (tokenId: number, price: string) => {
  /* needs the user to sign the transaction, so will use Web3Provider and sign it */
  try {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftMarketAddress, Market.abi, signer);

    /* user will be prompted to pay the asking proces to complete the transaction */
    const ethPrice = ethers.utils.parseUnits(price.toString(), "ether");
    const transaction = await contract.sellMarketNFT(nftAddress, tokenId, {
      value: ethPrice,
    });

    await transaction.wait();
    console.log("transaction successful");
  } catch (error) {
    console.log(error);
  }
};

export const getUserNFTs = async (
  setNfts: Dispatch<SetStateAction<any[]>>,
  setLoadingState: Dispatch<SetStateAction<boolean>>
) => {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();

  const marketContract = new ethers.Contract(
    nftMarketAddress,
    Market.abi,
    signer
  );
  const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
  const data = await marketContract.getUserNFTs();

  const items = await Promise.all(
    data.map(async (i: any) => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId);
      const meta = await axios.get(tokenUri);
      let price = ethers.utils.formatUnits(i.price.toString(), "ether");
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
      };
      return item;
    })
  );
  setNfts(items);
  setLoadingState(false);
};

export const getCreatedAndSoldUserNFTS = async (
  setSold: Dispatch<SetStateAction<any[]>>,
  setNfts: Dispatch<SetStateAction<any[]>>,
  setLoadingState: Dispatch<SetStateAction<boolean>>
) => {
  const web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
  });
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();

  const marketContract = new ethers.Contract(
    nftMarketAddress,
    Market.abi,
    signer
  );
  const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
  const data = await marketContract.fetchItemsCreated();

  const items = await Promise.all(
    data.map(async (i: any) => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId);
      const meta = await axios.get(tokenUri);
      let price = ethers.utils.formatUnits(i.price.toString(), "ether");
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        sold: i.sold,
        image: meta.data.image,
      };
      return item;
    })
  );
  /* create a filtered array of items that have been sold */
  const soldItems = items.filter((i) => i.sold);
  setSold(soldItems);
  setNfts(items);
  setLoadingState(false);
};
