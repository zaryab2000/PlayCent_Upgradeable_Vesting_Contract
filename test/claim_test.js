const PcntContract = artifacts.require("PlaycentTokenV1");

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

    const userVestingData_4 = await tokenInstance.walletToVestAllocations(accounts[4],7)
    const userVestingData_5 = await tokenInstance.walletToVestAllocations(accounts[5],8)
    const userVestingData_6 = await tokenInstance.walletToVestAllocations(accounts[6],9)
  
    // User 1 checks
    assert.equal(userVestingData_4[0].toString(),"7","Vesting Category Is wrongly assigned");
    assert.equal(userVestingData_4[1].toString(),user4_amount.toString(),"Total Amount is wrongly assigned");
    assert.equal(userVestingData_4[6].toString(),"0","Total Amount claimed Is wrongly assigned");
    assert.equal(userVestingData_4[7],true,"IsVesting Is wrongly assigned");
    assert.equal(userVestingData_4[8],false,"isTgeTokens Claimed is Wrong Is wrongly assigned");

    // User 2 checks
    assert.equal(userVestingData_5[0].toString(),"8","Vesting Category Is wrongly assigned for User 2");
    assert.equal(userVestingData_5[1].toString(),user5_amount.toString(),"Total Amount is wrongly assigned for User 2");
    assert.equal(userVestingData_5[6].toString(),"0","Total Amount claimed Is wrongly assigned");
    assert.equal(userVestingData_5[7],true,"IsVesting Is wrongly assigned");
    assert.equal(userVestingData_5[8],false,"IsVesting Is wrongly assigned for User 2");

  })
it("Transfer tokens to contract", async()=>{
    const intialSupply = ether("50000")
    await tokenInstance.transfer(tokenInstance.address,intialSupply);
    const contractBalance = await tokenInstance.balanceOf(tokenInstance.address);
    assert.equal(contractBalance.toString(),intialSupply.toString(),"Balance Not transferred");
  })


// USER 4, 5, 6 - trying to claim before LOCK PERIOD
  it("User 4 should not be able to claim amount before Cliff", async()=>{
       try{
           await tokenInstance.calculateClaimableTokens(accounts[4],7);
      }catch(error){
        const invalidOpcode = error.message.search("revert") >= 0;
        console.log(error.message);
        assert(invalidOpcode,`Expected revert but Got ${error}`)
      }
 })

  it("User 5 should not be able to claim amount before Cliff", async()=>{
       try{
           await tokenInstance.calculateClaimableTokens(accounts[5],8);
      }catch(error){
        const invalidOpcode = error.message.search("revert") >= 0;
        console.log(error.message);
        assert(invalidOpcode,`Expected revert but Got ${error}`)
      }
 })



  it("User 6 should not be able to claim amount before Cliff", async()=>{
       try{
           await tokenInstance.calculateClaimableTokens(accounts[6],9);
      }catch(error){
        const invalidOpcode = error.message.search("revert") >= 0;
        console.log(error.message);
        assert(invalidOpcode,`Expected revert but Got ${error}`)
      }
 })





    // 35 days later
  it("Time should increase by 35 Days", async() =>{
    await time.increase(time.duration.days(35));
  })

    it("User 4 should not be able to claim amount before Cliff", async()=>{
       try{
           await tokenInstance.calculateClaimableTokens(accounts[4],7);
      }catch(error){
        const invalidOpcode = error.message.search("revert") >= 0;
        console.log(error.message);
        assert(invalidOpcode,`Expected revert but Got ${error}`)
      }
 })

    it("User 6 should not be able to claim amount after 35 Days", async()=>{
        const user6_claims = ether('400');
        const actualClaims = await tokenInstance.calculateClaimableTokens(accounts[6],9);
        assert.equal(actualClaims.toString(),user6_claims.toString(),"Claims do not match for 35 days");
   
 })

  it("User 6 should be able to claim amount after 35 Days", async()=>{
        const balanceBefore = "0";
        const balanceAfter = ether('400');

        const totalAmountAllocated_user6 = ether('2000');
        const expectedClaim_user6 = ether('400');
        const totalClaimed_user6 = ether('400');

        const balanceBefore_user6 = await tokenInstance.balanceOf(accounts[6]);
        await tokenInstance._claimVestTokens(accounts[6],9,expectedClaim_user6, {from:accounts[6]});

        const totalClaimed = await tokenInstance.totalTokensClaimed(accounts[6],9);
        const userVestingData_6 = await tokenInstance.walletToVestAllocations(accounts[6],9);
        const balanceAfter_user6 = await tokenInstance.balanceOf(accounts[6]);

        assert.equal(balanceBefore_user6.toString(),balanceBefore.toString(),"Balance Before is Wrong");
        assert.equal(balanceAfter_user6.toString(),balanceAfter.toString(),"Balance after is not right");
        assert.equal(totalClaimed.toString(),totalClaimed_user6.toString(),"Total Claimed is wrong");
        assert.equal(userVestingData_6[7],true,"Vesting is false");
        assert.equal(userVestingData_6[8],false,"TGe Claimed is true");

       })


  it("User 5 should not be able to claim amount after 35 Days", async()=>{
        const user5_claims = ether('400');
        const actualClaims = await tokenInstance.calculateClaimableTokens(accounts[5],8);
        assert.equal(actualClaims.toString(),user5_claims.toString(),"Claims do not match for 35 days");
   
 })
    // 65 Days Later
  it("Time should increase by 65 Days", async() =>{
    await time.increase(time.duration.days(30));
  })

  it("User 4 should not be able to claim amount after 65 Days", async()=>{
        const user5_claims = ether('600');
        const actualClaims = await tokenInstance.calculateClaimableTokens(accounts[4],7);
        assert.equal(actualClaims.toString(),user5_claims.toString(),"Claims do not match for 65 days");
   
 })

  it("User 6 should not be able to claim amount after 65 Days", async()=>{
        const user6_claims = ether('600');
        const actualClaims = await tokenInstance.calculateClaimableTokens(accounts[6],9);
        assert.equal(actualClaims.toString(),user6_claims.toString(),"Claims do not match for 65 days");
   
 })

  it("User 6 should be able to claim amount after 65 Days", async()=>{
        const balanceBefore = ether('400');
        const balanceAfter = ether('600');

        const totalAmountAllocated_user6 = ether('2000');
        const expectedClaim_user6 = ether('200');
        const totalClaimed_user6 = ether('600');

        const balanceBefore_user6 = await tokenInstance.balanceOf(accounts[6]);
        await tokenInstance._claimVestTokens(accounts[6],9,expectedClaim_user6, {from:accounts[6]});

        const totalClaimed = await tokenInstance.totalTokensClaimed(accounts[6],9);
        const userVestingData_6 = await tokenInstance.walletToVestAllocations(accounts[6],9);
        const balanceAfter_user6 = await tokenInstance.balanceOf(accounts[6]);

        assert.equal(balanceBefore_user6.toString(),balanceBefore.toString(),"Balance Before is Wrong");
        assert.equal(balanceAfter_user6.toString(),balanceAfter.toString(),"Balance after is not right");
        assert.equal(totalClaimed.toString(),totalClaimed_user6.toString(),"Total Claimed is wrong");
        assert.equal(userVestingData_6[7],true,"Vesting is false");
        assert.equal(userVestingData_6[8],false,"TGe Claimed is true");

       })

  it("User 5 should not be able to claim amount after 65 Days", async()=>{
        const user5_claims = ether('800');
        const actualClaims = await tokenInstance.calculateClaimableTokens(accounts[5],8);
        assert.equal(actualClaims.toString(),user5_claims.toString(),"Claims do not match for 65 days");
   
 })
 

   // 95 Days Later
  it("Time should increase by 95 Days", async() =>{
    await time.increase(time.duration.days(30));
  })
  it("User 4 should not be able to claim amount after 95 Days", async()=>{
        const user5_claims = ether('900');
        const actualClaims = await tokenInstance.calculateClaimableTokens(accounts[4],7);
        assert.equal(actualClaims.toString(),user5_claims.toString(),"Claims do not match for 95 days");
   
 })


    it("User 6 should not be able to claim amount after 95 Days", async()=>{
        const user6_claims = ether('1000');
        const actualClaims = await tokenInstance.calculateClaimableTokens(accounts[6],9);
        assert.equal(actualClaims.toString(),user6_claims.toString(),"Claims do not match for 95 days");
   
 })
  it("User 5 should not be able to claim amount after 95 Days", async()=>{
        const user5_claims = ether('1200');
        const actualClaims = await tokenInstance.calculateClaimableTokens(accounts[5],8);
        assert.equal(actualClaims.toString(),user5_claims.toString(),"Claims do not match for 95 days");
   
 })

  // 125 Days Later
    it("Time should increase by 125 Days", async() =>{
    await time.increase(time.duration.days(30));
  })


    it("User 4 should not be able to claim amount after 125 Days", async()=>{
        const user5_claims = ether('1200');
        const actualClaims = await tokenInstance.calculateClaimableTokens(accounts[4],7);
        assert.equal(actualClaims.toString(),user5_claims.toString(),"Claims do not match for 125 days");
   
 })



  it("User 6 should not be able to claim amount after 125 Days", async()=>{
        const user6_claims = ether('1400');
        const actualClaims = await tokenInstance.calculateClaimableTokens(accounts[6],9);
        assert.equal(actualClaims.toString(),user6_claims.toString(),"Claims do not match for 125 days");
   
 })

    it("User 6 should be able to claim amount after 125 Days", async()=>{
        const balanceBefore = ether('600');
        const balanceAfter = ether('2000');

        const totalAmountAllocated_user6 = ether('2000');
        const expectedClaim_user6 = ether('1400');
        const totalClaimed_user6 = ether('2000');

        const balanceBefore_user6 = await tokenInstance.balanceOf(accounts[6]);
        await tokenInstance._claimVestTokens(accounts[6],9,expectedClaim_user6, {from:accounts[6]});

        const totalClaimed = await tokenInstance.totalTokensClaimed(accounts[6],9);
        const userVestingData_6 = await tokenInstance.walletToVestAllocations(accounts[6],9);
        const balanceAfter_user6 = await tokenInstance.balanceOf(accounts[6]);

        assert.equal(balanceBefore_user6.toString(),balanceBefore.toString(),"Balance Before is Wrong");
        assert.equal(balanceAfter_user6.toString(),balanceAfter.toString(),"Balance after is not right");
        assert.equal(totalClaimed.toString(),totalClaimed_user6.toString(),"Total Claimed is wrong");
        assert.equal(userVestingData_6[7],false,"Vesting is false");
        assert.equal(userVestingData_6[8],false,"TGe Claimed is true");

       })

  it("User 5 should not be able to claim amount after 125 Days", async()=>{
        const user5_claims = ether('1600');
        const actualClaims = await tokenInstance.calculateClaimableTokens(accounts[5],8);
        assert.equal(actualClaims.toString(),user5_claims.toString(),"Claims do not match for 125 days");
   
 })

   


      // 155
    it("Time should increase by 155 Days", async() =>{
    await time.increase(time.duration.days(30));
  })
  
  it("User 4 should not be able to claim amount after 155 Days", async()=>{
        const user5_claims = ether('1500');
        const actualClaims = await tokenInstance.calculateClaimableTokens(accounts[4],7);
        assert.equal(actualClaims.toString(),user5_claims.toString(),"Claims do not match for 155 days");
   
 })


  it("User 5 should not be able to claim amount after 155 Days", async()=>{
        const user5_claims = ether('2000');
        const actualClaims = await tokenInstance.calculateClaimableTokens(accounts[5],8);
        assert.equal(actualClaims.toString(),user5_claims.toString(),"Claims do not match for 155 days");
   
 })

   // 185 Days Later
    it("Time should increase by 185 Days", async() =>{
    await time.increase(time.duration.days(30));
  })

     it("User 4 should not be able to claim amount after 185 Days", async()=>{
        const user5_claims = ether('1800');
        const actualClaims = await tokenInstance.calculateClaimableTokens(accounts[4],7);
        assert.equal(actualClaims.toString(),user5_claims.toString(),"Claims do not match for 185 days");
   
 })

     // 215 Days Later
  it("Time should increase by 215 Days", async() =>{
    await time.increase(time.duration.days(30));
  })

     it("User 4 should not be able to claim amount after 215 Days", async()=>{
        const user5_claims = ether('2000');
        const actualClaims = await tokenInstance.calculateClaimableTokens(accounts[4],7);
        assert.equal(actualClaims.toString(),user5_claims.toString(),"Claims do not match for 215 days");
   
 })



});
