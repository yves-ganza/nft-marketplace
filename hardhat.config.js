require("@nomiclabs/hardhat-waffle");
const fs = require('fs')
const secret = fs.readFileSync('.secret', 'utf-8')
const [PROJECT_ID, PRIVATE_KEY] = secret.split('\n')

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${PROJECT_ID}`,
      accounts: [PRIVATE_KEY]
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${PROJECT_ID}`,
      accounts: [PRIVATE_KEY]
    }
  },
  solidity: "0.8.4",
};
