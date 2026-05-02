const Voting = artifacts.require("Voting");

module.exports = function (deployer) {
  // Deploy the Voting contract to the network
  deployer.deploy(Voting);
};