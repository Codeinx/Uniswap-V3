import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      forking: {
        url: "https://eth-mainnet.alchemyapi.io/v2/https://eth-mainnet.g.alchemy.com/v2/lXs6wQjjxEhj2allB3SgskFMZWqvhFJx", 
        blockNumber: 15000000, 
      },
    },
  },
};

export default config;