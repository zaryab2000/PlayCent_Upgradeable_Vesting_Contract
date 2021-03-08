const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const tokenContract = artifacts.require('PlaycentTokenV1');

module.exports = async function (deployer,network,accounts) {
  await deployProxy(tokenContract,[accounts[9]],{ deployer, initializer: 'initialize' });
  
};