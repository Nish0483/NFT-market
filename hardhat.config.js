require('@nomiclabs/hardhat-ethers');
require('@openzeppelin/hardhat-upgrades');

const { ethers } = require('ethers');
require('dotenv').config(); 

module.exports = {
  solidity: '0.8.0',
  networks: {
    hardhat: {},
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
