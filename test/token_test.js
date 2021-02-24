const PcntContract = artifacts.require("PlayToken");

var BN = require("bignumber.js");

const { time,ether } = require("@openzeppelin/test-helpers");

contract("TokenSale Contract", accounts => {
  let tokenInstance = null;

  before(async () => {
    tokenInstance = await PcntContract.deployed();
  });

  it("Contract is deployed", async () => {
    const contractAdd = tokenInstance.address;
    console.log(contractAdd);
  
  });
  //Testing the SWAN Token Contract
  it("Owner is Correct", async () => {
    const owner = await tokenInstance.owner();
    assert.equal(owner, accounts[0], "Owner's address is wrongly assigned");
  });

  it("Total Supply is correctly assigend", async ()=>{
    const total = await tokenInstance.totalSupply();
    const actualSupply = ether('60000000') 
    assert.equal(total.toString(),actualSupply.toString(),"Balance is not updated")

  })

  it("Owner has the all the minted totalSupply",async ()=>{
    const totalSupply = ether('60000000')
    const ownerBalance = await tokenInstance.balanceOf(accounts[0]);
    assert.equal(ownerBalance.toString(),totalSupply.toString(),"Balance is not updated")
  })

  it("Transfer tokens to contract", async()=>{
    const intialSupply = ether("5000")
    await tokenInstance.transfer(tokenInstance.address,intialSupply);
    const contractBalance = await tokenInstance.balanceOf(tokenInstance.address);
    assert.equal(contractBalance.toString(),intialSupply.toString(),"Balance Not transferred");
  })

  
  
  it("Send tokens via PlayToken", async() =>{
    const beforeBalance = "0";
    const transferToken = ether('100')
    const balanceOfUser_before = await tokenInstance.balanceOf(accounts[1]);
    await tokenInstance.sendTokens(accounts[1],transferToken);
    const balanceOfUser = await tokenInstance.balanceOf(accounts[1]);
    const balanceOfContract = await tokenInstance.balanceOf(tokenInstance.address);
    console.log(`Contract Balance ${balanceOfContract}`)
    assert.equal(balanceOfUser.toString(),transferToken.toString(),"Balance not transferred");
    assert.equal(balanceOfUser_before.toString(),beforeBalance.toString(),"BalanceBefore not transferred");

  })
});
