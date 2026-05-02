module.exports = {
  networks: {
    // Local Ganache development network
    development: {
      host: "127.0.0.1", // Ganache runs locally
      port: 8545,         // Default Ganache port
      network_id: "*",    // Match any network ID
    },
  },

  compilers: {
    solc: {
      version: "0.8.0", // Must match pragma in Voting.sol
    },
  },
};