import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";

import { network } from "@config";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  defaultNetwork: network,
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_MUMBAI_URL_ID}`,
      accounts: [`0x${process.env.METAMASK_PRIVATE_KEY}`],
    },
    mainnet: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_POLYGON_URL_ID}`,
      accounts: [`0x${process.env.METAMASK_PRIVATE_KEY}`],
    }
    // ropsten: {
    //   url: process.env.ROPSTEN_URL || "",
    //   accounts:
    //     process.env.METAMASK_PRIVATE_KEY !== undefined ? [process.env.METAMASK_PRIVATE_KEY] : [],
    // },
  },
  // gasReporter: {
  //   enabled: process.env.REPORT_GAS !== undefined,
  //   currency: "USD",
  // },
  // etherscan: {
  //   apiKey: process.env.ETHERSCAN_API_KEY,
  // },
  paths: {
    artifacts: './artifacts',
  },
};

export default config;
