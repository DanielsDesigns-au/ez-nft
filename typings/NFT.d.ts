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
    keyProp: string;
  }

  interface CreateNFTFormData {
    name: string;
    description: string;
    price: number;
  }
}

interface BoughtNFT {
  price: string;
  tokenId: number;
  seller: string;
  owner: string;
  image: string;
}

interface CreatedNFT extends BoughtNFT {
  sold: boolean;
}

interface SoldNFT extends CreatedNFT { };
