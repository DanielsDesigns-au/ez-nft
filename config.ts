// Default network for hardhat - Change to map
export const network: "localhost" | "mumbai" | "mainnet" = 'mumbai';

// Localhost Deployed Contract Addresses
// export const nftMarketAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
// export const nftAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
// export const JsonRpcProvider = '';

// Polygon Mumbai Addresses - Needs to be publicly available as it is used client side
export const nftMarketAddress = process.env.NEXT_PUBLIC_MUMBAI_NFT_MARKET_ADDRESS || '';
export const nftAddress = process.env.NEXT_PUBLIC_MUMBAI_NFT_ADDRESS || '';
export const JsonRpcProvider = 'https://rpc-mumbai.maticvigil.com';

// Polygon Main-net Addresses - Needs to be publicly available as it is used client side
// export const nftMarketAddress = process.env.NEXT_PUBLIC_POLYGON_NFT_MARKET_ADDRESS || '';
// export const nftAddress = process.env.NEXT_PUBLIC_POLYGON_NFT_ADDRESS || '';
// export const JsonRpcProvider = 'https://rpc-mainnet.maticvigil.com';
