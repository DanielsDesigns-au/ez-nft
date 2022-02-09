import React, { useEffect, useState } from 'react';
import { ipfsOptions, pinToIPFS } from '@lib/ezNFT';
import { nftAddress, nftMarketAddress } from '@config';

import { Header } from '@components';
import Market from '@artifacts/contracts/EzNFTMarket.sol/EzNFTMarket.json';
import NFT from '@artifacts/contracts/EzNFT.sol/EzNFT.json';
import { NextPage } from 'next';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import styles from './mint.module.scss';
import { useRouter } from 'next/router';

interface Props {}

export const TheMint: NextPage<Props> = ({}) => {
  const [fileUrl, setFileUrl] = useState('');
  const [formInput, updateFormInput] = useState({
    price: '',
    name: '',
    description: '',
  });
  const router = useRouter();

  const createClient = async () => {
    const client = await ipfsHttpClient(ipfsOptions);
    return client;
  };

  const uploadFile = async (file: File) => {
    try {
      // const client = await createClient();
      // console.log('client loaded');
      const res = await pinToIPFS(file);
      console.log(res);
      // const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      // await setFileUrl(url);
      return true;
    } catch (error) {
      console.log('Error creating client or uploading file: ', error);
      return false;
    }
  };

  const createMarket = async (formData: NFT.CreateNFTFormData) => {
    const client = await createClient();
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

  const createSale = async (url: string, formData: NFT.CreateNFTFormData) => {
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

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.files?.[0]) {
      console.log(e.target.files[0]);
      const didUpload = await uploadFile(e.target.files[0]);
      !!didUpload && console.log(`file uploaded to: ${fileUrl}`);
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    alert(JSON.stringify(formInput));
    // await createMarket({
    //   price: parseFloat(formInput.price),
    //   name: formInput.name,
    //   description: formInput.description,
    //   fileUrl: fileUrl,
    // });
  };

  return (
    <>
      <Header />
      <main className={styles.container}>
        <div className={styles.divider}>
          <h3>Market Place</h3>
        </div>
        <form className={styles.form}>
          <input
            placeholder='Asset Name'
            className={styles.nameInput}
            onChange={(e) =>
              updateFormInput({ ...formInput, name: e.target.value })
            }
          />
          <textarea
            placeholder='Asset Description'
            className={styles.descInput}
            onChange={(e) =>
              updateFormInput({ ...formInput, description: e.target.value })
            }
          />
          <input
            placeholder='Asset Price in Eth'
            className={styles.priceInput}
            onChange={(e) =>
              updateFormInput({ ...formInput, price: e.target.value })
            }
          />
          <input
            type='file'
            name='Asset'
            className={styles.fileInput}
            onChange={(e) => handleFile(e)}
          />
          {fileUrl && (
            <img className={styles.nftDisplay} width='350' src={fileUrl} />
          )}
          <button onClick={(e) => handleSubmit(e)} className={styles.submit}>
            Create Digital Asset
          </button>
        </form>
      </main>
    </>
  );
};

export default TheMint;
