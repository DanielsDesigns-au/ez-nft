import { nftAddress, nftMarketAddress } from '@config';

import Market from '@artifacts/contracts/EzNFTMarket.sol/EzNFTMarket.json';
import NFT from '@artifacts/contracts/EzNFT.sol/EzNFT.json';
import Web3Modal from 'web3modal';
import axios from 'axios';
import { ethers } from 'ethers';
import { create as ipfsHttpClient } from 'ipfs-http-client';

const client = ipfsHttpClient(process.env.INFURA_CLIENT_URL);

export const loadNFTs = async () => {
  /* create a generic provider and query for unsold market items */
  const provider = new ethers.providers.JsonRpcProvider();
  const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
  const marketContract = new ethers.Contract(
    nftMarketAddress,
    Market.abi,
    provider
  );
  const data = await marketContract.getMarketNFTs();
  console.log(data);

  /*
   *  map over items returned from smart contract and format
   *  them as well as fetch their token metadata
   */
  const items: Array<NFT.TransformedNFT> = await Promise.all(
    data.map(async (i: NFT.MarketNFT) => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId);
      const meta = await axios.get(tokenUri);
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
      let item: NFT.TransformedNFT = {
        price,
        tokenId: i.tokenId,
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      };
      return item;
    })
  );
  return items;
  //   setLoadingState('loaded');
};

export const buyNft = async (nft: NFT.MarketNFT) => {
  /* needs the user to sign the transaction, so will use Web3Provider and sign it */
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(nftMarketAddress, Market.abi, signer);

  /* user will be prompted to pay the asking proces to complete the transaction */
  const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
  const transaction = await contract.createMarketNFT(nftAddress, nft.tokenId, {
    value: price,
  });
  await transaction.wait();
  return loadNFTs();
};

export const uploadFile = async (file: File) => {
  // file = e.target.files[0];
  try {
    const added = await client.add(file, {
      progress: (prog) => console.log(`received: ${prog}`),
    });
    const url = `https://ipfs.infura.io/ipfs/${added.path}`;
    return url;
  } catch (error) {
    console.log('Error uploading file: ', error);
    return null;
  }
}

export const createMarket = async (formData: NFT.CreateNFTFormData) => {
  const { name, description, price, fileUrl } = formData;
  if (!name || !description || !price || !fileUrl) return;
  /* first, upload to IPFS */
  const data = JSON.stringify({
    name,
    description,
    image: fileUrl,
  });
  try {
    const added = await client.add(data);
    const url = `https://ipfs.infura.io/ipfs/${added.path}`;
    /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
    createSale(url, formData);
  } catch (error) {
    console.log('Error uploading file: ', error);
  }
};

export const createSale = async (url: string, formData: NFT.CreateNFTFormData) => {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();

  /* next, create the item */
  let contract = new ethers.Contract(nftAddress, NFT.abi, signer);
  let transaction = await contract.createToken(url);
  let tx = await transaction.wait();
  let event = tx.events[0];
  let value = event.args[2];
  let tokenId = value.toNumber();
  const price = ethers.utils.parseUnits(formData.price.toString(), 'ether');

  /* then list the item for sale on the marketplace */
  contract = new ethers.Contract(nftMarketAddress, Market.abi, signer);
  let listingPrice = await contract.getListingPrice();
  listingPrice = listingPrice.toString();

  transaction = await contract.createMarketNFT(nftAddress, tokenId, price, {
    value: listingPrice,
  });
  await transaction.wait();

  // returns true if transaction is successful
  return true;
};

// export const pinJSONToIPFS = async (nftMetaData) => {
//   const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
//   //making axios POST request to Pinata ⬇️
//   return axios
//     .post(url, nftMetaData, {
//       headers: {
//         pinata_api_key: process.env.PINATA_PUBLIC_KEY,
//         pinata_secret_api_key: process.env.PINATA_PRIVATE_KEY,
//       }
//     })
//     .then(function (response) {
//       return {
//         success: true,
//         pinataUrl: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
//       };
//     })
//     .catch(function (error) {
//       console.log(error)
//       return {
//         success: false,
//         message: error.message,
//       }

//     });
// };
