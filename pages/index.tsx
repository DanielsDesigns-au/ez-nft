import { buyNft, loadNFTs } from "@lib/ezNFT";

import { GetServerSideProps } from "next";
import Head from "next/head";
import { Header } from "@components";
import Image from "next/image";
import type { NextPage } from "next";
import styles from "./index.module.scss";

interface Props {
    nfts: Array<NFT.TransformedNFT>;
}

const Home: NextPage<Props> = ({ nfts }) => {
    // console.log(nfts);
    return (
        <>
            <Header />
            <main className={styles.container}>
                <div className={styles.divider}>
                    <h3>Market Place</h3>
                </div>

                {!nfts || nfts.length === 0 ? (
                    <h4>No nfts 😭</h4>
                ) : (
                    <div className={styles.nftDisplay}>
                        {nfts.map((nft, index) => (
                            <div className={styles.nftCard} key={nft?.keyProp}>
                                <div className={styles.imageSquare}>
                                    <img
                                        src={nft.image}
                                        className={styles.displayImage}
                                        loading="lazy"
                                    />
                                </div>
                                <div className={styles.details}>
                                    <h2 className={styles.name}>{nft.name}</h2>
                                    <h5 className={styles.price}>
                                        {nft.price} ETH
                                    </h5>
                                    <p className={styles.description}>
                                        {nft.description}
                                    </p>
                                    {/* currently doesnt work cause need to correctly serialize tokenId */}
                                    {/* <button onClick={(e) => buyNft(nft)}>
                                        Buy Me
                                    </button> */}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const nfts = await loadNFTs();

        return {
            props: {
                nfts,
            },
        };
    } catch (error) {
        console.log(error);
        const nfts = [""];
        return {
            props: {
                nfts,
            },
        };
    }
};

export default Home;
