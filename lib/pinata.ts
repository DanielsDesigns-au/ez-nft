import pinataSDK from "@pinata/sdk";

// Pinata SDK initialisation - Used in local API
export const pinata = pinataSDK(
  process.env.PINATA_PUBLIC_KEY || "",
  process.env.PINATA_PRIVATE_KEY || ""
);
