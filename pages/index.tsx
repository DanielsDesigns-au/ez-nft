import { buyNft, getUnsoldNFTs } from "@lib/ezNFT";

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
  return (
    <>
      <Head>
        <title>
          Ez NFTs | {process.env.NODE_ENV !== "production" ? "Dev" : ""}
        </title>
      </Head>
      <Header />
      <main className={styles.container}>
        <div className={styles.divider}>
          <h3>Market Place</h3>
        </div>

        {!nfts || nfts.length === 0 ? (
          <h4>No nfts for sale 😭</h4>
        ) : (
          <div className={styles.nftDisplay}>
            {nfts.map((nft, i) => (
              <div className={styles.nftCard} key={nft?.keyProp || `nft-${i}`}>
                <div
                  className={styles.imageSquare}
                  style={{ backgroundImage: `url(${nft?.image})` }}
                ></div>
                <div className={styles.details}>
                  <div className={styles.topDetails}>
                    <p className={styles.artist}>{nft?.name}</p>
                    <p className={styles.priceText}>Price</p>
                  </div>
                  <div className={styles.midDetails}>
                    <h4 className={styles.tokenId}>#{nft?.tokenId}</h4>
                    <h4 className={styles.price}>
                      {nft?.price}{" "}
                      <img
                        src="/Images/etherium.png/"
                        className={styles.priceSymbol}
                      />
                    </h4>
                  </div>
                  <p className={styles.description}>{nft?.description}</p>
                  <div className={styles.botDetails}>
                    <button
                      className={styles.quickBuy}
                      onClick={(e) => buyNft(nft?.tokenId, nft?.price)}
                    >
                      Quick Buy
                    </button>
                    <button className={styles.like}>Like</button>
                  </div>
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
    // ---- For Testing styles ----

    // const nfts: any = [];
    // for (var i = 0; i < 30; i++) {
    //   nfts.push({
    //     price: Math.round(Math.random() * 1000) / 10000,
    //     tokenId: Math.round(Math.random() * 1000),
    //     image: "/Images/ethSquare.png",
    //     name: "NFT Test Title",
    //     description:
    //       "Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
    //   });
    // }

    const nfts = await getUnsoldNFTs();

    return {
      props: {
        nfts,
      },
    };
  } catch (error) {
    console.log(error);
    const nfts: Array<any> = [];
    return {
      props: {
        nfts,
      },
    };
  }
};

export default Home;
