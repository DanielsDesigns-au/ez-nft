import { nftAddress, nftMarketAddress } from '@config';

import Market from '@artifacts/contracts/EzNFTMarket.sol/EzNFTMarket.json';
import NFT from '@artifacts/contracts/EzNFT.sol/EzNFT.json';
import { Options } from 'ipfs-http-client';
import Web3Modal from 'web3modal';
import axios from 'axios';
import { ethers } from 'ethers';

const projectId = process.env.INFURA_IPFS_PROJECT_ID;
const projectSecret = process.env.INFURA_IPFS_PROJECT_SECRET;
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

export const ipfsOptions: Options = {
  host: 'ipfs.infura.io/api/v0',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  }
}

export const pinToIPFS = async (data: any) => {
  const url = 'https://ipfs.infura.io:5001/api/v0/add';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_ID}`,
    },
    mode: 'no-cors',
    body: data
  }).then(response => {
    console.log(response.status)
    return response;
  })
  return res;
}

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
