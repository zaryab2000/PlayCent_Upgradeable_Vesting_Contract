const PcntContract = artifacts.require("PlayToken");

var BN = require("bignumber.js");

const { time,ether,expectRevert } = require("@openzeppelin/test-helpers");

contract("TokenSale Contract", accounts => {
  let tokenInstance = null;

  before(async () => {
    tokenInstance = await PcntContract.deployed();
  });


  it("Owner should be able to add User4,5,6 to the Sale Vesting Schedule", async()=>{
    const user4_amount = ether('2000');
    const user5_amount = ether('2000');
    const user6_amount = ether('2000');

    await tokenInstance.addVestingDetails([accounts[4]],[user4_amount],7);
    await tokenInstance.addVestingDetails([accounts[5]],[user5_amount],8);
    await tokenInstance.addVestingDetails([accounts[6]],[user6_amount],9);

    const userVestingData_4 = await tokenInstance.userToVestingDetails(accounts[4],7)
    const userVestingData_5 = await tokenInstance.userToVestingDetails(accounts[5],8)
    const userVestingData_6 = await tokenInstance.userToVestingDetails(accounts[6],9)
  
    // User 1 checks
    assert.equal(userVestingData_4[0].toString(),"7","Vesting Category Is wrongly assigned");
    assert.equal(userVestingData_4[1],accounts[4],"Wallet Address Is wrongly assigned");
    assert.equal(userVestingData_4[2].toString(),user4_amount.toString(),"Total Amount is wrongly assigned");
    assert.equal(userVestingData_4[6].toString(),"10000000000000000000","Vesting Rate Is wrongly assigned");
    assert.equal(userVestingData_4[7].toString(),"0","Total Amount claimed Is wrongly assigned");
    assert.equal(userVestingData_4[8],true,"IsVesting Is wrongly assigned");

    // User 2 checks
    assert.equal(userVestingData_5[0].toString(),"8","Vesting Category Is wrongly assigned for User 2");
    assert.equal(userVestingData_5[1],accounts[5],"Wallet Address Is wrongly assigned for User 2");
    assert.equal(userVestingData_5[2].toString(),user5_amount.toString(),"Total Amount is wrongly assigned for User 2");
    assert.equal(userVestingData_5[6].toString(),"15000000000000000000","Vesting Rate Is wrongly assigned  for User 2");
    //assert.equal(userVestingData_5[7].toString(),user5_amount.toString(),"Remaining Amount Is wrongly assigned for User 2");
    assert.equal(userVestingData_5[7].toString(),"0","Total Amount claimed wrongly assigned for User 2");
    assert.equal(userVestingData_5[8],true,"IsVesting Is wrongly assigned for User 2");

  })
it("Transfer tokens to contract", async()=>{
    const intialSupply = ether("50000")
    await tokenInstance.transfer(tokenInstance.address,intialSupply);
    const contractBalance = await tokenInstance.balanceOf(tokenInstance.address);
    assert.equal(contractBalance.toString(),intialSupply.toString(),"Balance Not transferred");
  })



  it("User 5 should not be able to claim For VEST Tokens before lockUp period", async()=>{
     try{
          await tokenInstance.claimVestTokens(accounts[5],8,{from:accounts[5]});
      }catch(error){
        const invalidOpcode = error.message.search("revert") >= 0;
        console.log(error.message);
        assert(invalidOpcode,`Expected revert but Got ${error}`)
      }
 })

  // 91 days later
  it("Time should increase by 91 Days", async() =>{
    await time.increase(time.duration.days(91));
  })


   it("User 5 should be able to claim After 91 days Period", async()=>{
      const user5_amount = ether('2000');
      const expectedClaims_user5 = ether('400');
      const totalClaims_user5 = ether('400');
      const currentBalance_user5 = "0";

      const balanceBefore_user5 = await tokenInstance.balanceOf(accounts[5]);
      const actualClaim_user5_before = await tokenInstance.calculateClaimableTokens(accounts[5],8);

      // Claim Claiming Function
      await tokenInstance.claimVestTokens(accounts[5],8,{from:accounts[5]});
      const userVestingData_5 = await tokenInstance.userToVestingDetails(accounts[5],8)
      
      const balanceAfter_user5 = await tokenInstance.balanceOf(accounts[5]);
      
      assert.equal(balanceBefore_user5.toString(),currentBalance_user5.toString(),"No Toknes Transferred")
      assert.equal(balanceAfter_user5.toString(),expectedClaims_user5.toString(),"No Toknes Transferred")
      assert.equal(actualClaim_user5_before.toString(),expectedClaims_user5.toString(),"Expected claims is not equal to actual")
      assert.equal(userVestingData_5[7].toString(),totalClaims_user5.toString(),"Total Amount Claimed Didn't update");
      assert.equal(userVestingData_5[8],true,"isVesting Boolean is false before than expected")
      assert.equal(userVestingData_5[9],false,"tgeTokensClaimed Boolean is true");
})

it("Time should increase by 30 Days", async() =>{
    await time.increase(time.duration.days(30));
  })
//121 days later
 it("User 5 should be able to claim After 121 days Period", async()=>{
      const user5_amount = ether('2000');
      const expectedClaims_user5 = ether('900');
      const totalClaims_user5 = ether('1300');
      const currentBalance_user5 = ether('400');

      const balanceBefore_user5 = await tokenInstance.balanceOf(accounts[5]);

      // Claim Claiming Function
       const actualClaim_user5_before = await tokenInstance.calculateClaimableTokens(accounts[5],8);
      await tokenInstance.claimVestTokens(accounts[5],8,{from:accounts[5]});
      const userVestingData_5 = await tokenInstance.userToVestingDetails(accounts[5],8)
      
      const balanceAfter_user5 = await tokenInstance.balanceOf(accounts[5]);
      
      assert.equal(balanceBefore_user5.toString(),currentBalance_user5.toString(),"No Toknes Transferred")
      assert.equal(balanceAfter_user5.toString(),totalClaims_user5.toString(),"No Toknes Transferred")
      assert.equal(actualClaim_user5_before.toString(),expectedClaims_user5.toString(),"Expected claims is not equal to actual")
      assert.equal(userVestingData_5[7].toString(),totalClaims_user5.toString(),"Total Amount Claimed Didn't update");
      assert.equal(userVestingData_5[8],true,"isVesting Boolean is false before than expected")
      assert.equal(userVestingData_5[9],false,"tgeTokensClaimed Boolean is true");
})

 it("User 6 should be able to claim After 151 days Period", async()=>{
      const user6_amount = ether('2000');
      const expectedClaims_user6 = ether('400');
      const totalClaims_user6 = ether('2000');
      const currentBalance_user6 = ether('1600');

      const balanceBefore_user6 = await tokenInstance.balanceOf(accounts[6]);
      const actualClaim_user6_before = await tokenInstance.calculateClaimableTokens(accounts[6],9);
      // Claim Claiming Function
      await tokenInstance.claimVestTokens(accounts[6],9,{from:accounts[6]});
      const userVestingData_6 = await tokenInstance.userToVestingDetails(accounts[6],9)
      
      const balanceAfter_user6 = await tokenInstance.balanceOf(accounts[6]);

      console.log(balanceBefore_user6.toString())
      console.log(balanceAfter_user6.toString())
      console.log(actualClaim_user6_before.toString())
      console.log(userVestingData_6[7].toString())
      
      // assert.equal(balanceBefore_user5.toString(),currentBalance_user5.toString(),"No Toknes Transferred")
      // assert.equal(balanceAfter_user5.toString(),totalClaims_user5.toString(),"No Toknes Transferred")
      // assert.equal(actualClaim_user5_before.toString(),expectedClaims_user5.toString(),"Expected claims is not equal to actual")
      // assert.equal(userVestingData_5[7].toString(),totalClaims_user5.toString(),"Total Amount Claimed Didn't update");
      // assert.equal(userVestingData_5[8],false,"isVesting Boolean is false before than expected")
      // assert.equal(userVestingData_5[9],true,"tgeTokensClaimed Boolean is true");
})

it("Time should increase by 30 Days", async() =>{
    await time.increase(time.duration.days(30));
  })


// it('User 5 should be able to Claim TGE tokens after TGE Time', async ()=>{
//         const user5_amount = ether('2000');
//       const totalClaims_user5 = ether('1600');
//       const currentBalance_user5 = ether('1300');

//       const balanceBefore_user5 = await tokenInstance.balanceOf(accounts[5]);

//       // Claim Claiming Function
//       await tokenInstance.claimTGETokens(accounts[5],8,{from:accounts[5]});
//       const userVestingData_5 = await tokenInstance.userToVestingDetails(accounts[5],8)
      
//       const balanceAfter_user5 = await tokenInstance.balanceOf(accounts[5]);
//        assert.equal(balanceBefore_user5.toString(),currentBalance_user5.toString(),"No Toknes Transferred before")
//       assert.equal(balanceAfter_user5.toString(),totalClaims_user5.toString(),"No Toknes Transferred after")
//       assert.equal(userVestingData_5[7].toString(),totalClaims_user5.toString(),"Total Amount Claimed Didn't update");
//       assert.equal(userVestingData_5[8],true,"isVesting Boolean is false before than expected")
//       assert.equal(userVestingData_5[9],true,"tgeTokensClaimed Boolean is true");

//  })
// // 151
 it("User 5 should be able to claim After 151 days Period", async()=>{
      const user5_amount = ether('2000');
      const expectedClaims_user5 = ether('400');
      const totalClaims_user5 = ether('2000');
      const currentBalance_user5 = ether('1600');

      const balanceBefore_user5 = await tokenInstance.balanceOf(accounts[5]);
      const actualClaim_user5_before = await tokenInstance.calculateClaimableTokens(accounts[5],8);
      // Claim Claiming Function
      await tokenInstance.claimVestTokens(accounts[5],8,{from:accounts[5]});
      const userVestingData_5 = await tokenInstance.userToVestingDetails(accounts[5],8)
      
      const balanceAfter_user5 = await tokenInstance.balanceOf(accounts[5]);

      console.log(balanceBefore_user5.toString())
      console.log(balanceAfter_user5.toString())
      console.log(actualClaim_user5_before.toString())
      console.log(userVestingData_5[7].toString())
      
      // assert.equal(balanceBefore_user5.toString(),currentBalance_user5.toString(),"No Toknes Transferred")
      // assert.equal(balanceAfter_user5.toString(),totalClaims_user5.toString(),"No Toknes Transferred")
      // assert.equal(actualClaim_user5_before.toString(),expectedClaims_user5.toString(),"Expected claims is not equal to actual")
      // assert.equal(userVestingData_5[7].toString(),totalClaims_user5.toString(),"Total Amount Claimed Didn't update");
      // assert.equal(userVestingData_5[8],false,"isVesting Boolean is false before than expected")
      // assert.equal(userVestingData_5[9],true,"tgeTokensClaimed Boolean is true");
})





});
