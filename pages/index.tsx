import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Header } from '@components';
import Image from 'next/image';
import type { NextPage } from 'next';
import { loadNFTs } from '@lib/ezNFT';
import styles from './index.module.scss';

interface Props {
  nfts: Array<NFT.TransformedNFT>;
}

const Home: NextPage<Props> = ({ nfts }) => {
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
            {nfts.map((nft) => (
              <div className={styles.nftCard}>
                <h2>{nft.name}</h2>
                <h5>{nft.price}</h5>
                <p>{nft.description}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const nfts = await loadNFTs();

  return {
    props: {
      nfts,
    },
  };
};

export default Home;
