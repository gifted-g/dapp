// require("@nomicfoundation/hardhat-toolbox");

// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.19",
// };

require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
const { PRIVATE_KEY } = process.env;
module.exports = {
	solidity: "0.8.19",
	defaultNetwork: "sepolia",
	networks: {
		hardhat: {},
		sepolia: {
			url: "https://eth-sepolia.g.alchemy.com/v2/DfNsmTLQmxg_FTTsBYowVn5A7A3TnfEX",
			accounts: [`0x${PRIVATE_KEY}`],
		},
	},
};
