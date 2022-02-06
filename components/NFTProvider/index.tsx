import React, { useEffect, useState } from 'react';
//import styles from './index.module.scss';

const NFTProvider = ({ ...props }) => {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  useEffect(() => {
    // loadNFTs();
  }, []);

  return <>{props.children}</>;
};

export default NFTProvider;
