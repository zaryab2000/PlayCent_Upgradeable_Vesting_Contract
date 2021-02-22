const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const tokenContract = artifacts.require('PlaycentTokenn');

module.exports = async function (deployer) {
  await deployProxy(tokenContract,{ deployer, initializer: 'initialize' });
  
};