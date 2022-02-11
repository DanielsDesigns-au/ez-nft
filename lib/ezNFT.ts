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
    const res = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
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
    // console.log(data);

    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */
    const items = await Promise.all(
        data.map(async (i: any, index: number) => {
            const price = await ethers.utils.formatUnits(i.price.toString(), 'ether');
            try {
                const tokenUri = await tokenContract.tokenURI(i.tokenId);
                const meta = await axios.get(tokenUri);
                // Even though it says await has no impact, it does!
                const item = await {
                    price,
                    tokenId: i.tokenId.toHexString(),
                    seller: i.seller,
                    owner: i.owner,
                    image: meta.data.image,
                    name: meta.data.name,
                    description: meta.data.description,
                    keyProp: `nftIndex-${index}`
                };
                return item;
            } catch (error) {
                // Even though it says await has no impact, it does!
                const item = await {
                    price,
                    tokenId: i.tokenId.toHexString(),
                    seller: i.seller,
                    owner: i.owner,
                    image: "Unknow",
                    name: "Unknow",
                    description: "Unknow",
                    keyProp: `nftIndex-${index}`,
                };
                return item;
            }
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

const uploadFile = async (file: File) => {
    try {
        // const res = await pinToIPFS(file);
        // console.log(res);
        console.log(process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_ID);
        // const url = `https://ipfs.infura.io/ipfs/${added.path}`;
        // await setFileUrl(url);
        return true;
    } catch (error) {
        console.log('Error creating client or uploading file: ', error);
        return false;
    }
};

const createMarket = async (formData: NFT.CreateNFTFormData, fileUrl: string) => {
    // const client = await createClient();
    const { name, description, price } = formData;
    if (!name || !description || !price || !fileUrl) return;
    /* first, upload to IPFS */
    const data = JSON.stringify({
        name,
        description,
        image: fileUrl,
    });

    try {
        // const added = await client.add(data);
        // const url = `https://ipfs.infura.io/ipfs/${added.path}`;

        /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
        // createSale(url, formData);
    } catch (error) {
        console.log('Error uploading file: ', error);
    }
};
