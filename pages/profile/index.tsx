import { useEffect, useState } from "react";

import Head from "next/head";
import { Header } from "@components";
import { ethers } from "ethers";
import { getUserNFTs } from "@lib/ezNFT";
import styles from "./profile.module.scss";

export const Profile = () => {
  const [nfts, setNfts] = useState<Array<any>>([]);
  const [loadingState, setLoadingState] = useState(true);

  useEffect(() => {
    getUserNFTs(setNfts, setLoadingState);
  }, []);

  return (
    <>
      <Head>
        <title>
          {process.env.NODE_ENV !== "production" ? "🚧" : ""} Profile | Ez NFTs
        </title>
      </Head>
      <Header />
      <main className={styles.container}>
        <div className={styles.divider}>
          <h3>NFTs you bought</h3>
        </div>

        {!nfts || nfts.length === 0 ? (
          <h4>You dont own any NFTs 😭</h4>
        ) : (
          <div className={styles.nftDisplay}>
            {nfts.map((nft) => (
              <div className={styles.nftCard} key={nft?.tokenId}>
                <div className={styles.imageSquare}>
                  <img
                    src={nft.image}
                    className={styles.displayImage}
                    loading="lazy"
                  />
                </div>
                <div className={styles.details}>
                  <h2 className={styles.name}>{nft.price}</h2>
                  <p className={styles.from}>From: {nft.seller}</p>
                  <p className={styles.to}>To: {nft.owner}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.divider}>
          <h3>NFTs you have for sale</h3>
        </div>
        {/* To Implement */}
      </main>
    </>
  );
};

export default Profile;
