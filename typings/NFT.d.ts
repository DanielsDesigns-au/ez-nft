declare namespace NFT {
  interface MarketNFT {
    nftId: number;
    nftContract: string;
    tokenId: number;
    seller: number;
    owner: number;
    price: number;
    sold: number;
  }

  interface TransformedNFT {
    price: string;
    tokenId: number;
    seller: number;
    owner: number;
    image: string;
    name: string;
    description: string;
  }

  interface CreateNFTFormData {
    name: string;
    description: string;
    price: number;
  }
}

// interface IPFSFileData {
//   file: File;
//   pinataMetaData?: {
//     ['name']: string;
//     ['keyvalues']: Record<string, string>
//   },
//   pinataOptions?: {
//     cidVersion: number;
//   },
// }