import React, { useState } from 'react';
import { createMarket, uploadFile } from '@lib/ezNFT';

import { Header } from '@components';
import { NextPage } from 'next';
import styles from './mint.module.scss';
import { useRouter } from 'next/router';

interface Props {}

export const TheMint: NextPage<Props> = ({}) => {
  const [fileUrl, setFileUrl] = useState(null);
  const [file, setFile] = useState<File>();
  const [formInput, updateFormInput] = useState({
    price: '',
    name: '',
    description: '',
    fileUrl: '',
  });
  const router = useRouter();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.files) {
      await setFile(e.target.files[0]);
      const url = await uploadFile(e.target.files[0]);
      url && (await updateFormInput({ ...formInput, fileUrl: url }));
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    alert(JSON.stringify(formInput));
    // await createMarket({
    //   price: parseFloat(formInput.price),
    //   name: formInput.name,
    //   description: formInput.description,
    //   fileUrl: formInput.fileUrl,
    // });
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
            placeholder='Asset Name'
            className={styles.nameInput}
            onChange={(e) =>
              updateFormInput({ ...formInput, name: e.target.value })
            }
          />
          <textarea
            placeholder='Asset Description'
            className={styles.descInput}
            onChange={(e) =>
              updateFormInput({ ...formInput, description: e.target.value })
            }
          />
          <input
            placeholder='Asset Price in Eth'
            className={styles.priceInput}
            onChange={(e) =>
              updateFormInput({ ...formInput, price: e.target.value })
            }
          />
          <input
            type='file'
            name='Asset'
            className={styles.fileInput}
            onChange={(e) => handleFile(e)}
          />
          {fileUrl && (
            <img
              className={styles.nftDisplay}
              width='350'
              src={formInput.fileUrl}
            />
          )}
          <button onClick={(e) => handleSubmit(e)} className={styles.submit}>
            Create Digital Asset
          </button>
        </form>
      </main>
    </>
  );
};

export default TheMint;
