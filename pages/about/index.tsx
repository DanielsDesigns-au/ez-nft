import Head from "next/head";
import { Header } from "@components";
import React from "react";
import styles from "./about.module.scss";

const about = () => {
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
          <h3>Market Place</h3>
        </div>
        <h4>Nothing much to see here</h4>
      </main>
    </>
  );
};

export default about;
