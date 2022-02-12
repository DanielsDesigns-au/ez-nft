// Default network for hardhat
export const network: "localhost" | "mumbai" | "mainnet" = 'localhost';

// RPC Providers for polygon https://docs.polygon.technology/docs/develop/network-details/network/
export const JsonRpcProvider =
  (network as string) === "mumbai"
    ? "https://rpc-mumbai.maticvigil.com"
    : (network as string) === "mainnet"
    ? "https://rpc-mainnet.maticvigil.com"
    : "";

// Localhost Contracts Addresses dont need to be stored in .env for local
export const nftMarketAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const nftAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

// Polygon Mumbai Addresses
// export const nftMarketAddress = process.env.MUMBAI_NFT_MARKET_ADDRESS || '';
// export const nftAddress = process.env.MUMBAI_NFT_ADDRESS || '';

// Polygon Main-net Addresses
// export const nftMarketAddress = process.env.POLYGON_NFT_MARKET_ADDRESS || '';
// export const nftAddress = process.env.POLYGON_NFT_ADDRESS || '';
