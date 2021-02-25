const PcntContract = artifacts.require("PlayToken");

var BN = require("bignumber.js");

const { time,ether,expectRevert } = require("@openzeppelin/test-helpers");

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

  // it("Transfer tokens to contract", async()=>{
  //   const intialSupply = ether("50000")
  //   await tokenInstance.transfer(tokenInstance.address,intialSupply);
  //   const contractBalance = await tokenInstance.balanceOf(tokenInstance.address);
  //   assert.equal(contractBalance.toString(),intialSupply.toString(),"Balance Not transferred");
  // })

  
  
  // it("Send tokens via PlayToken", async() =>{
  //   const beforeBalance = "0";
  //   const transferToken = ether('100')
  //   const balanceOfUser_before = await tokenInstance.balanceOf(accounts[1]);
  //   await tokenInstance.sendTokens(accounts[1],transferToken);
  //   const balanceOfUser = await tokenInstance.balanceOf(accounts[1]);
  //   const balanceOfContract = await tokenInstance.balanceOf(tokenInstance.address);
  //   console.log(`Contract Balance ${balanceOfContract}`)
  //   assert.equal(balanceOfUser.toString(),transferToken.toString(),"Balance not transferred");
  //   assert.equal(balanceOfUser_before.toString(),beforeBalance.toString(),"BalanceBefore not transferred");

  // })


  // Adding User details w.r.t vesting Categories by Owner
  it("Owner should be able to add User1 to the Vesting Schedule", async()=>{
    const user1_amount = ether('2000');
    const user2_amount = ether('4000');
    const user3_amount = ether('6000');
    const userArray = [accounts[1],accounts[2],accounts[3]];
    const amountsArray = [user1_amount,user2_amount,user3_amount];

    await tokenInstance.addVestingDetails(userArray,amountsArray,0);

    const userVestingData_1 = await tokenInstance.userToVestingDetails(accounts[1])
    const userVestingData_2 = await tokenInstance.userToVestingDetails(accounts[2])
    const userVestingData_3 = await tokenInstance.userToVestingDetails(accounts[3])
  
    // User 1 checks
    assert.equal(userVestingData_1[0].toString(),"0","Vesting Category Is wrongly assigned");
    assert.equal(userVestingData_1[1],accounts[1],"Wallet Address Is wrongly assigned");
    assert.equal(userVestingData_1[2].toString(),user1_amount.toString(),"Total Amount is wrongly assigned");
    assert.equal(userVestingData_1[6].toString(),"5000000000000000000","Vesting Rate Is wrongly assigned");
    assert.equal(userVestingData_1[7].toString(),user2_amount.toString(),"Total Remaining Amount Is wrongly assigned");
    assert.equal(userVestingData_1[8].toString(),"0","Total Amount claimed Is wrongly assigned");
    assert.equal(userVestingData_1[9],true,"IsVesting Is wrongly assigned");

    // User 2 checks
    assert.equal(userVestingData_2[0].toString(),"0","Vesting Category Is wrongly assigned for User 2");
    assert.equal(userVestingData_2[1],accounts[2],"Wallet Address Is wrongly assigned for User 2");
    assert.equal(userVestingData_2[2].toString(),user2_amount.toString(),"Total Amount is wrongly assigned for User 2");
    assert.equal(userVestingData_2[6].toString(),"5000000000000000000","Vesting Rate Is wrongly assigned  for User 2");
    assert.equal(userVestingData_2[7].toString(),user2_amount.toString(),"Remaining Amount Is wrongly assigned for User 2");
    assert.equal(userVestingData_2[8].toString(),"0","Total Amount claimed wrongly assigned for User 2");
    assert.equal(userVestingData_2[9],true,"IsVesting Is wrongly assigned for User 2");

  })


  // Adding User details w.r.t vesting Categories by only Owner
  // it("Only Owner should be able to add User1 to the Vesting Schedule", async()=>{
  //     const user1_amount = ether('2000');
  //   const user2_amount = ether('4000');
  //   const user3_amount = ether('6000');
  //     const userArray = [accounts[1],accounts[2],accounts[3]];
  //   const amountsArray = [user1_amount,user2_amount,user3_amount];
  //     expectRevert(
  //       await tokenInstance.addVestingDetails
  //       (userArray,amountsArray,0 , {from:accounts[4]}),
  //       "Only Owner Function Cannot be Called by NON Owner");
    
  // })

  //Check Normal Vesting RATE withRespect to time
  it("Vesting Rates should be calculated as expected", async()=>{
    
  })

  //Check Sale Vesting RATE withRespect to time
   it("Sale Vesting Rates should be calculated as expected", async()=>{
    
  })

  // Check Claimable token for a particular user at any given time
   it("Claimable token should be calculated correctly at any given time", async()=>{
    
  })

});
