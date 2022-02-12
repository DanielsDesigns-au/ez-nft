import { getCreatedAndSoldUserNFTS, getUsersBoughtNFTs } from "@lib/ezNFT";
import { useEffect, useState } from "react";

import Head from "next/head";
import { Header } from "@components";
import Link from "next/link";
import { ethers } from "ethers";
import styles from "./profile.module.scss";

export const Profile = () => {
  const [boughtNfts, setBoughtNfts] = useState<Array<BoughtNFT>>([]);
  const [loadingBoughtState, setLoadingBoughtState] = useState(true);
  const [createdNfts, setCreatedNfts] = useState<Array<CreatedNFT>>([]);
  const [soldNfts, setSoldNfts] = useState<Array<SoldNFT>>([]);
  const [loadingCreatedSoldState, setLoadingCreatedSoldState] = useState(true);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      getUsersBoughtNFTs(setBoughtNfts, setLoadingBoughtState);
      getCreatedAndSoldUserNFTS(
        setSoldNfts,
        setCreatedNfts,
        setLoadingCreatedSoldState
      );
    }
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

        {!boughtNfts || boughtNfts.length === 0 ? (
          <h4>You dont own any NFTs 😭</h4>
        ) : (
          <div className={styles.nftDisplay}>
            {boughtNfts.map((nft) => (
              <div className={styles.nftCard} key={nft?.tokenId}>
                <div className={styles.imageSquare}>
                  <img
                    src={nft.image}
                    className={styles.displayImage}
                    loading="lazy"
                  />
                </div>
                <div className={styles.details}>
                  <div className={styles.priceBox}>
                    <img
                      src="/Images/etherium.png"
                      className={styles.ethSymbol}
                      loading="lazy"
                    />
                    <h2 className={styles.price}>Bought for: {nft.price}</h2>
                  </div>
                  <p className={styles.from}>From: {nft.seller}</p>
                  <p className={styles.to}>To: {nft.owner}</p>
                  <p className={styles.tokenId}>#{nft.tokenId}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.divider}>
          <h3>NFTs you have for sale</h3>
        </div>
        {!createdNfts || createdNfts.length === 0 ? (
          <h4>
            Looks like you dont have any NFTs you created left. Mint some at the{" "}
            <Link href="/mint" passHref>
              <a className={styles.textLink}>NFT Mint</a>
            </Link>
          </h4>
        ) : (
          <div className={styles.nftDisplay}>
            {createdNfts.map((nft) => (
              <div className={styles.nftCard} key={nft?.tokenId}>
                <div className={styles.imageSquare}>
                  <img
                    src={nft.image}
                    className={styles.displayImage}
                    loading="lazy"
                  />
                </div>
                <div className={styles.details}>
                  <h2 className={styles.price}>Sale Price: {nft.price}</h2>
                  <p className={styles.from}>From: {nft.seller}</p>
                  <p className={styles.to}>To: {nft.owner}</p>
                  <p className={styles.tokenId}>#{nft.tokenId}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.divider}>
          <h3>NFTs you have sold 🤑</h3>
        </div>
        {!soldNfts || soldNfts.length === 0 ? (
          <h4>
            Looks like you haven't sold any NFTs yet, try get some hype around
            them!
          </h4>
        ) : (
          <div className={styles.nftDisplay}>
            {soldNfts.map((nft) => (
              <div className={styles.nftCard} key={nft?.tokenId}>
                <div
                  className={styles.imageSquare}
                  style={{ backgroundImage: `url(${nft.image})` }}
                >
                  {/* <img
                    src={nft.image}
                    className={styles.displayImage}
                    loading="lazy"
                  /> */}
                </div>
                <div className={styles.details}>
                  <div className={styles.priceBox}>
                    <h2 className={styles.price}>Bought for: {nft.price}</h2>
                    <img
                      src="/Images/etherium.png"
                      className={styles.ethSymbol}
                      loading="lazy"
                    />
                  </div>
                  <p className={styles.from}>From: {nft.seller}</p>
                  <p className={styles.to}>To: {nft.owner}</p>
                  <p className={styles.tokenId}>#{nft.tokenId}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* To Implement */}
      </main>
    </>
  );
};

export default Profile;
