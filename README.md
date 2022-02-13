# Setting up local development

Firstly you need to compile the scripts so it creates the artifacts (in `./artifacts`) necessary for the front end to interact with the solidity contract functions. You can do this by running hardhat tests or hardhat compile. I suggest running hardhat test so you can check my smart contracts are working for you too.

```shell
npx hardhat test
```

OR

```shell
npx hardhat compile
```

If you have a look through any functions that interact with NFT data you will see that they are calling the same named functions as the ones specified in the `./contacts` solidity files.

Now you are ready to set up the local web3 environment/blockchain using hardhat. This also generating us 19 testing accounts with some phat stacks of ETH to play around with 🤑

```shell
npx hardhat node
```

Copy one of the account private addresses from the console output (leave hardhat node running), then go to chrome and if you haven't already install [MetaMask](https://metamask.io/download/). This will allow you to add the account to your MetaMask wallet so you can use it in local the environment.

> Note I had to enable test networks at the top by selecting networks dropdown at the top right next to your account icon and click `show/hide test networks` then selecting localhost:8545

also if having trouble adding accounts or selecting the network come back to this step after running next js dev environment.

run the following command to deploy the smart contacts to the local network

```shell
npx hardhat run scripts/deploy.ts --network localhost
```

Then copy the market address and the nft address to their respective variables in `./config.ts`

Copy environment variables example

```shell
cp .env.example .env
```

The only environment variables required are the Pinata API Keys, the other variables are for when you want to change networks in the `./hardhat.config.ts`.

You can now run the app without any hassle the usual way.

```shell
npm run dev
```

# Testing it

Try minting an nft from the mint section then go back to home after it has finished minting and see it load from the blockchain!

> Note lowest price atm you can list a NFT for is 0.05 ether, but you can change it in the `./contracts/EzNFTMarket.sol` you just need to recompile (and redeploy?).

You can also swap to a different test account and buy one of the NFTs from the Home, which will then appear as a purchased NFT in the profile section.

Enjoy trying it out! slack me if you have any issues 😁

# Helpful links

- [Pinata SaaS](https://app.pinata.cloud/signin)
- [Polygon RPC Providers](https://docs.polygon.technology/docs/develop/network-details/network/)
- [Polygon Faucet](https://faucet.polygon.technology/)

## Default ReadMe from Hardhat

# Advanced Sample Hardhat Project

This project demonstrates an advanced Hardhat use case, integrating other tools commonly used alongside Hardhat in the ecosystem.

The project comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts. It also comes with a variety of other tools, preconfigured to work with the project code.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.ts
TS_NODE_FILES=true npx ts-node scripts/deploy.ts
npx eslint '**/*.{js,ts}'
npx eslint '**/*.{js,ts}' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```

# Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your Ropsten node URL (eg from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

```shell
hardhat run --network ropsten scripts/sample-script.ts
```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "Hello, Hardhat!"
```

# Performance optimizations

For faster runs of your tests and scripts, consider skipping ts-node's type checking by setting the environment variable `TS_NODE_TRANSPILE_ONLY` to `1` in hardhat's environment. For more details see [the documentation](https://hardhat.org/guides/typescript.html#performance-optimizations).
