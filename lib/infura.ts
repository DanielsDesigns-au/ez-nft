import { Options } from "ipfs-http-client";

const projectId = process.env.INFURA_IPFS_PROJECT_ID;
const projectSecret = process.env.INFURA_IPFS_PROJECT_SECRET;
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

export const ipfsOptions: Options = {
  host: "ipfs.infura.io/api/v0",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
};

export const pinToIPFS = async (data: any) => {
  const res = await fetch("https://ipfs.infura.io:5001/api/v0/add", {
    method: "POST",
    headers: {
      Authorization: `Basic ${process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_ID}`,
    },
    mode: "no-cors",
    body: data,
  }).then((response) => {
    console.log(response.status);
    return response;
  });
  return res;
};
