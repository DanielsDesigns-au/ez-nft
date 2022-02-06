import Link from 'next/link';
import { NextPage } from 'next';
import React from 'react';
import styles from './header.module.scss';

interface Props {}

export const Header: NextPage<Props> = ({}) => {
  return (
    <nav className={styles.container}>
      <div className={styles.left}>
        <h2>Ez NFT</h2>
      </div>
      <div className={styles.middle}></div>
      <div className={styles.right}>
        <Link href='/'>
          <a>Home</a>
        </Link>
        <Link href='/mint'>
          <a>Mint</a>
        </Link>
        <Link href='/about'>
          <a>About</a>
        </Link>
        <Link href='/profile'>
          <a>Profile</a>
        </Link>
      </div>
    </nav>
  );
};

export default Header;
