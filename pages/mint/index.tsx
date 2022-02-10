import React, { useEffect, useState } from "react";
import { nftAddress, nftMarketAddress } from "@config";

import { Header } from "@components";
import Market from "@artifacts/contracts/EzNFTMarket.sol/EzNFTMarket.json";
import NFT from "@artifacts/contracts/EzNFT.sol/EzNFT.json";
import { NextPage } from "next";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import styles from "./mint.module.scss";
import { useRouter } from "next/router";

const ipfsGateway = "https://gateway.pinata.cloud/ipfs/";
const auth = `Bearer ${process.env.PINATA_JWT_TOKEN}`;

interface Props {}

export const TheMint: NextPage<Props> = ({}) => {
    const [fileUrl, setFileUrl] = useState("");
    const [tempUrl, setTempUrl] = useState("");

    const [dataUrl, setDataUrl] = useState<string | ArrayBuffer | null>();
    const [filepath, setFilepath] = useState("");
    const [formInput, updateFormInput] = useState({
        price: "",
        name: "",
        description: "",
    });

    const encodeImageFileAsURL = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e?.target?.files?.[0] || null;
        if (!file) return;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            // console.log(reader.result);
            setDataUrl(reader.result);
        };
    };

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e?.target?.files?.[0];
        encodeImageFileAsURL(e);
        setFilepath(file?.name || "Default_Pinata_Name");
        file && setTempUrl(URL.createObjectURL(file));
    };

    const uploadFile = async () => {
        if (!dataUrl) return;
        const metaData = JSON.stringify({
            dataUrl: dataUrl,
            path: filepath,
        });

        try {
            const res = await fetch("http://localhost:3000/api/pinFileToIPFS", {
                method: "POST",
                body: metaData,
            })
                .then((response) => {
                    return response.json();
                })
                .then((body) => {
                    return body;
                })
                .catch((error) => error);

            const { IpfsHash, PinSize, Timestamp } = res;
            console.log(
                `File Uploaded!\n\tHash:${IpfsHash}\n\tPinSize:${PinSize}\n\tTimestamp:${Timestamp}`
            );

            setFileUrl(`${ipfsGateway}${IpfsHash}`);
            return;
        } catch (error) {
            console.log("Error on client side file upload: ", error);
            return;
        }
    };

    useEffect(() => {
        // console.log(dataUrl);
        uploadFile();
    }, [dataUrl]);

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        alert(JSON.stringify(formInput));
        // if (fileUrl !== "" && fileUrl !== ipfsGateway) {
        //     const saleSuccess = await createMarket({
        //         price: parseFloat(formInput.price),
        //         name: formInput.name,
        //         description: formInput.description,
        //     });
        //     !!saleSuccess ? console.log("Sale Success") : console.log("Sale Failed")
        // }
    };

    // const createMarket = async (formData: NFT.CreateNFTFormData) => {
    //     const { name, description, price } = formData;
    //     if (!name || !description || !price || !fileUrl) return;
    //     /* first, upload to IPFS */
    //     const data = JSON.stringify({
    //         name,
    //         description,
    //         image: fileUrl,
    //     });

    //     try {
    //         const res = await fetch("http://localhost:3000/api/pinJSONToIPFS", {
    //             method: "POST",
    //             body: data,
    //         })
    //             .then((response) => {
    //                 return response.json();
    //             })
    //             .then((body) => {
    //                 return body;
    //             })
    //             .catch((error) => error);

    //         const { IpfsHash, PinSize, Timestamp } = res;
    //         console.log(
    //             `JSON Uploaded!\n\tHash:${IpfsHash}\n\tPinSize:${PinSize}\n\tTimestamp:${Timestamp}`
    //         );

    //         const url = `${ipfsGateway}${IpfsHash}`;
    //         /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
    //         const saleSuccess =  await createSale(url, formData);
    //         return saleSuccess;
    //     } catch (error) {
    //         console.log("Error uploading file: ", error);
    //     }
    // };

    // const createSale = async (url: string, formData: NFT.CreateNFTFormData) => {
    //     const web3Modal = new Web3Modal();
    //     const connection = await web3Modal.connect();
    //     const provider = new ethers.providers.Web3Provider(connection);
    //     const signer = provider.getSigner();

    //     /* next, create the item */
    //     let contract = new ethers.Contract(nftAddress, NFT.abi, signer);
    //     let transaction = await contract.createToken(url);
    //     let tx = await transaction.wait();
    //     let event = tx.events[0];
    //     let value = event.args[2];
    //     let tokenId = value.toNumber();
    //     const price = ethers.utils.parseUnits(
    //         formData.price.toString(),
    //         "ether"
    //     );

    //     /* then list the item for sale on the marketplace */
    //     contract = new ethers.Contract(nftMarketAddress, Market.abi, signer);
    //     let listingPrice = await contract.getListingPrice();
    //     listingPrice = listingPrice.toString();

    //     transaction = await contract.createMarketNFT(
    //         nftAddress,
    //         tokenId,
    //         price,
    //         {
    //             value: listingPrice,
    //         }
    //     );
    //     await transaction.wait();

    //     // returns true if transaction is successful
    //     return true;
    // };

    return (
        <>
            <Header />
            <main className={styles.container}>
                <div className={styles.divider}>
                    <h3>Market Place</h3>
                </div>
                <form className={styles.form}>
                    <input
                        placeholder="Asset Name"
                        className={styles.nameInput}
                        onChange={(e) =>
                            updateFormInput({
                                ...formInput,
                                name: e.target.value,
                            })
                        }
                    />
                    <textarea
                        placeholder="Asset Description"
                        className={styles.descInput}
                        onChange={(e) =>
                            updateFormInput({
                                ...formInput,
                                description: e.target.value,
                            })
                        }
                    />
                    <input
                        placeholder="Asset Price in Eth"
                        className={styles.priceInput}
                        onChange={(e) =>
                            updateFormInput({
                                ...formInput,
                                price: e.target.value,
                            })
                        }
                    />
                    <input
                        type="file"
                        name="Asset"
                        className={styles.fileInput}
                        onChange={(e) => handleFile(e)}
                    />
                    {fileUrl && (
                        <img
                            className={styles.nftDisplay}
                            width="350"
                            src={tempUrl}
                        />
                    )}
                    <button
                        onClick={(e) => handleSubmit(e)}
                        className={styles.submit}
                    >
                        Create Digital Asset
                    </button>
                </form>
            </main>
        </>
    );
};

export default TheMint;
