import { nftAddress, nftMarketAddress } from '@config';

import Market from '@artifacts/contracts/EzNFTMarket.sol/EzNFTMarket.json';
import NFT from '@artifacts/contracts/EzNFT.sol/EzNFT.json';
import axios from 'axios';
import pinataSDK from '@pinata/sdk';

export const pinFileToIPFS = async (data: any) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const res = await fetch(url, {
    method: 'POST',
    body: data,
    headers: {
      'Content-Type': `multipart/form-data;`,
      Authorization: `Bearer ${process.env.PINATA_JWT_TOKEN}`,
    },
  })
    .then(function (response) {
      response.status === 200 &&
        console.log('Pinata file successfully uploaded!');
      return response;
    })
    .catch(function (error) {
      console.log(`Error uploading to pinata: ${error}`);
      return error;
    });
  return res;
};

const testConnection = async () => {
  // const res = await fetch('http://localhost:3000/api/testConnection');
  // console.log(res);
};

export const pinata = pinataSDK(
  process.env.PINATA_PUBLIC_KEY || '',
  process.env.PINATA_PRIVATE_KEY || ''
);
