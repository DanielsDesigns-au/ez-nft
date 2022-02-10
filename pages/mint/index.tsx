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

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e?.target?.files?.[0];
        if (!file) {
            console.log("no file");
            return;
        }
        const tempPath = URL.createObjectURL(file);
        console.log(tempPath);
        setTempUrl(tempPath);
        setFilepath(file?.name || "Default_Pinata_Name");
        encodeImageFileAsURL(e);
    };

    const uploadFile = async () => {
        if (!dataUrl || !filepath) return;
        const metaData = JSON.stringify({
            dataUrl: dataUrl,
            path: filepath,
        });

        try {
            const res = await fetch("http://localhost:3000/api/pinFileToIPFS", {
                method: "POST",
                body: metaData,
            })
                .then((response) => response.json())
                .then((body) => body)
                .catch((error) => error);

            const { IpfsHash, PinSize, Timestamp } = res;
            console.log(
                `File Uploaded!\n\tHash:${IpfsHash}\n\tPinSize:${PinSize}\n\tTimestamp:${Timestamp}`
            );

            const imageUrl = `${ipfsGateway}${IpfsHash}`;
            const saleSuccess = await createMarket(imageUrl);

            return;
        } catch (error) {
            console.log("Error on client side file upload: ", error);
            return;
        }
    };

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        uploadFile();
        // alert(JSON.stringify(formInput));
        // if (fileUrl !== "" && fileUrl !== ipfsGateway) {
        //     !!saleSuccess
        //         ? console.log("Sale Success")
        //         : console.log("Sale Failed");
        // }
    };

    const createMarket = async (imageUrl: string) => {
        const { name, description, price } = formInput;
        if (!name || !description || !price || !imageUrl) return;
        /* first, upload to IPFS */
        const data = JSON.stringify({
            name,
            description,
            image: imageUrl,
        });

        try {
            const { IpfsHash, PinSize, Timestamp } = await fetch(
                "http://localhost:3000/api/pinJSONToIPFS",
                {
                    method: "POST",
                    body: data,
                }
            )
                .then((response) => response.json())
                .then((body) => body)
                .catch((error) => error);

            const jsonUrl = `${ipfsGateway}${IpfsHash}`;
            console.log(
                `Pinned JSON ${IpfsHash ? "S" : "Uns"}uccessfully ${
                    "@ " + (IpfsHash && jsonUrl)
                }`
            );

            if (!IpfsHash || !PinSize || !Timestamp) return;

            console.log(
                `JSON Uploaded!\n\tHash:${IpfsHash}\n\tPinSize:${PinSize}\n\tTimestamp:${Timestamp}`
            );

            /* after file is uploaded to IPFS, pass the jsonUrl to save it on Polygon */

            const saleSuccess = await createSale(jsonUrl);
            return saleSuccess;
        } catch (error) {
            console.log("Error uploading file: ", error);
            return false;
        }
    };

    const createSale = async (url: string) => {
        try {
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
            const price = ethers.utils.parseUnits(formInput.price, "ether");

            /* then list the item for sale on the marketplace */
            contract = new ethers.Contract(
                nftMarketAddress,
                Market.abi,
                signer
            );
            let listingPrice = await contract.getListingPrice();
            listingPrice = listingPrice.toString();

            transaction = await contract.createMarketNFT(
                nftAddress,
                tokenId,
                price,
                {
                    value: listingPrice,
                }
            );
            await transaction.wait();
            console.log(`Created nft successfully`);
        } catch (error) {
            console.log(`Create Sale Error: ${error}`);
            return false;
        }

        // returns true if transaction is successful
        return true;
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
                    {tempUrl && (
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
