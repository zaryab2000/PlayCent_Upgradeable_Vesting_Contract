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


  // Adding User details w.r.t vesting Categories by Owner
 
  // Adding User details w.r.t vesting Categories by Owner
  it("Owner should be able to add User1,2 and 3 to the Vesting Schedule", async()=>{
    const user1_amount = ether('2000');
    const user2_amount = ether('4000');
    const user3_amount = ether('6000');
    const userArray = [accounts[1],accounts[2],accounts[3]];
    const amountsArray = [user1_amount,user2_amount,user3_amount];

    await tokenInstance.addVestingDetails(userArray,amountsArray,0);

    const userVestingData_1 = await tokenInstance.userToVestingDetails(accounts[1],0)
    const userVestingData_2 = await tokenInstance.userToVestingDetails(accounts[2],0)
    const userVestingData_3 = await tokenInstance.userToVestingDetails(accounts[3],0)
  
    // User 1 checks
    assert.equal(userVestingData_1[0].toString(),"0","Vesting Category Is wrongly assigned");
    assert.equal(userVestingData_1[1],accounts[1],"Wallet Address Is wrongly assigned");
    assert.equal(userVestingData_1[2].toString(),user1_amount.toString(),"Total Amount is wrongly assigned");
    assert.equal(userVestingData_1[6].toString(),"5000000000000000000","Vesting Rate Is wrongly assigned");
    assert.equal(userVestingData_1[7].toString(),user1_amount.toString(),"Total Remaining Amount Is wrongly assigned");
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

  it("Owner should be able to add User4,5,6 to the Sale Vesting Schedule", async()=>{
    const user4_amount = ether('2000');
    const user5_amount = ether('4000');
    const user6_amount = ether('6000');

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
    assert.equal(userVestingData_4[7].toString(),user4_amount.toString(),"Total Remaining Amount Is wrongly assigned");
    assert.equal(userVestingData_4[8].toString(),"0","Total Amount claimed Is wrongly assigned");
    assert.equal(userVestingData_4[9],true,"IsVesting Is wrongly assigned");

    // User 2 checks
    assert.equal(userVestingData_5[0].toString(),"8","Vesting Category Is wrongly assigned for User 2");
    assert.equal(userVestingData_5[1],accounts[5],"Wallet Address Is wrongly assigned for User 2");
    assert.equal(userVestingData_5[2].toString(),user5_amount.toString(),"Total Amount is wrongly assigned for User 2");
    assert.equal(userVestingData_5[6].toString(),"15000000000000000000","Vesting Rate Is wrongly assigned  for User 2");
    assert.equal(userVestingData_5[7].toString(),user5_amount.toString(),"Remaining Amount Is wrongly assigned for User 2");
    assert.equal(userVestingData_5[8].toString(),"0","Total Amount claimed wrongly assigned for User 2");
    assert.equal(userVestingData_5[9],true,"IsVesting Is wrongly assigned for User 2");

  })


  /**
   * Time Checks Boundaries
   * Below 60 Days
   * Between 60 to 90 days
   * Between 90 to 120
   * Between 120 to 150 days
   * Between 150 to 213 days
   */

   // 90 DAYS LATER (Considering the fact that the CLIFF itself is 60 days)
   // 90 Days means => 90 - 60 DAYS(Of Cliff) = 1 month. Thus interests calculated for the 1 month(only) after CLIFF LockUp Peiod
  it("Time should increase by Days", async() =>{
    await time.increase(time.duration.days(90));
  })
 
 it("Calculate Claimable Tokens after 90 days Cliff", async() =>{
  		const expectedClaims_user3 = 0;
  		const expectedClaims_user4 = ether('300')
  		const expectedClaims_user5 = ether('800')
  		const expectedClaims_user6 = ether('1200')

  		const actualClaim_user3 = await tokenInstance.calculateClaimableTokens(accounts[3],0);
  		const actualClaim_user4 = await tokenInstance.calculateClaimableTokens(accounts[4],7);
  		const actualClaim_user5 = await tokenInstance.calculateClaimableTokens(accounts[5],8);
  		const actualClaim_user6 = await tokenInstance.calculateClaimableTokens(accounts[6],9);

  		assert.equal(expectedClaims_user3.toString(), actualClaim_user3.toString(),"Expected Claims didn't match correctly for User 4")  		
  		assert.equal(expectedClaims_user4.toString(), actualClaim_user4.toString(),"Expected Claims didn't match correctly for User 4")
  		assert.equal(expectedClaims_user5.toString(), actualClaim_user5.toString(),"Expected Claims didn't match correctly for User 5")
  		assert.equal(expectedClaims_user6.toString(), actualClaim_user6.toString(),"Expected Claims didn't match correctlyfor User 6")

  })

 // 120 DAYS LATER

it("Time should increase by Days", async() =>{
    await time.increase(time.duration.days(30));
  })
 
 it("Calculate Claimable Tokens after 120 days Cliff", async() =>{
  		const expectedClaims_user3 = 0;
  		const expectedClaims_user4 = ether('600')
  		const expectedClaims_user5 = ether('1600')
  		const expectedClaims_user6 = ether('6000')

  		
      const actualClaim_user3 = await tokenInstance.calculateClaimableTokens(accounts[3],0);
      const actualClaim_user4 = await tokenInstance.calculateClaimableTokens(accounts[4],7);
      const actualClaim_user5 = await tokenInstance.calculateClaimableTokens(accounts[5],8);
      const actualClaim_user6 = await tokenInstance.calculateClaimableTokens(accounts[6],9);


  		console.log(actualClaim_user4.toString())
  		console.log(expectedClaims_user4.toString())
  		assert.equal(actualClaim_user3.toString(), expectedClaims_user3.toString(),"Expected Claims didn't match correctly for User 3")  		
  		assert.equal(actualClaim_user4.toString(), expectedClaims_user4.toString(),"Expected Claims didn't match correctly for User 4")
  		assert.equal(actualClaim_user5.toString(), expectedClaims_user5.toString(),"Expected Claims didn't match correctly for User 5")
  		assert.equal(actualClaim_user6.toString(), expectedClaims_user6.toString(),"Expected Claims didn't match correctlyfor User 6")

  })


//   // 150 DAYS LATER

it("Time should increase by Days", async() =>{
    await time.increase(time.duration.days(30));
  })
 
 it("Calculate Claimable Tokens after 150 days Cliff", async() =>{
  		const expectedClaims_user3 = 0;
  		const expectedClaims_user4 = ether('900')
  		const expectedClaims_user5 = ether('4000')
  		const expectedClaims_user6 = ether('4800');

  	
      const actualClaim_user3 = await tokenInstance.calculateClaimableTokens(accounts[3],0);
      const actualClaim_user4 = await tokenInstance.calculateClaimableTokens(accounts[4],7);
      const actualClaim_user5 = await tokenInstance.calculateClaimableTokens(accounts[5],8);
      const actualClaim_user6 = await tokenInstance.calculateClaimableTokens(accounts[6],9);


  		assert.equal(actualClaim_user3.toString(), expectedClaims_user3.toString(),"Expected Claims didn't match correctly for User 3")  		
  		assert.equal(actualClaim_user4.toString(), expectedClaims_user4.toString(),"Expected Claims didn't match correctly for User 4")
  		assert.equal(actualClaim_user5.toString(), expectedClaims_user5.toString(),"Expected Claims didn't match correctly for User 5")
  		assert.equal(actualClaim_user6.toString(), expectedClaims_user6.toString(),"Expected Claims didn't match correctlyfor User 6")


  })

   // 211 DAYS LATER

it("Time should increase by Days", async() =>{
    await time.increase(time.duration.days(63));
  })
 
 it("Calculate Claimable Tokens after 211 days Cliff", async() =>{
  		const expectedClaims_user3 = 0;
  		const expectedClaims_user4 = ether('2000')
  		const expectedClaims_user5 = ether('4000');
  		const expectedClaims_user6 = ether('6000');

      const actualClaim_user3 = await tokenInstance.calculateClaimableTokens(accounts[3],0);
      const actualClaim_user4 = await tokenInstance.calculateClaimableTokens(accounts[4],7);
      const actualClaim_user5 = await tokenInstance.calculateClaimableTokens(accounts[5],8);
      const actualClaim_user6 = await tokenInstance.calculateClaimableTokens(accounts[6],9);

	
	    assert.equal(actualClaim_user3.toString(), expectedClaims_user3.toString(),"Expected Claims didn't match correctly for User 3")  		
  		assert.equal(actualClaim_user4.toString(), expectedClaims_user4.toString(),"Expected Claims didn't match correctly for User 4")
  		assert.equal(actualClaim_user5.toString(), expectedClaims_user5.toString(),"Expected Claims didn't match correctly for User 5")
  		assert.equal(actualClaim_user6.toString(), expectedClaims_user6.toString(),"Expected Claims didn't match correctlyfor User 6")

  })
    // 395 DAYS LATER

it("Time should increase by Days", async() =>{
    await time.increase(time.duration.days(185));
  })
 
 it("Calculate Claimable Tokens after 395 days Cliff", async() =>{
  		const expectedClaims_user3 = ether('300');
  		const expectedClaims_user4 = ether('2000');
  		const expectedClaims_user5 = ether('4000');
  		const expectedClaims_user6 = ether('6000');

      const actualClaim_user3 = await tokenInstance.calculateClaimableTokens(accounts[3],0);
      const actualClaim_user4 = await tokenInstance.calculateClaimableTokens(accounts[4],7);
      const actualClaim_user5 = await tokenInstance.calculateClaimableTokens(accounts[5],8);
      const actualClaim_user6 = await tokenInstance.calculateClaimableTokens(accounts[6],9);

  		assert.equal(actualClaim_user3.toString(), expectedClaims_user3.toString(),"Expected Claims didn't match correctly for User 3")  		
  		assert.equal(actualClaim_user4.toString(), expectedClaims_user4.toString(),"Expected Claims didn't match correctly for User 4")
  		assert.equal(actualClaim_user5.toString(), expectedClaims_user5.toString(),"Expected Claims didn't match correctly for User 5")
  		assert.equal(actualClaim_user6.toString(), expectedClaims_user6.toString(),"Expected Claims didn't match correctlyfor User 6")


  })
  it("Time should increase by Days", async() =>{
    await time.increase(time.duration.days(974));
  })

  it("Calculate Claimable Tokens after Total Vesting Duration is over", async() =>{
  		const expectedClaims_user1 = ether('2000')

  		const actualClaim_user1 = await tokenInstance.calculateClaimableTokens(accounts[1],0);

  		assert.equal(expectedClaims_user1.toString(), actualClaim_user1.toString(),"Expected Claims didn't match correctly")
  })



 //  // Time 61 Days Later
 // it("Sale Vesting Rates should be calculated as expected Between 60 to 90 days", async()=>{
 //      const expectedRate4 = ether('15');
 //      const expectedRate5 = ether('20');
 //      const expectedRate6 = ether('20');
     
 //      const vestRate_4 = await tokenInstance.getVestingRate(accounts[4]);
 //      const vestRate_5 = await tokenInstance.getVestingRate(accounts[5]);
 //      const vestRate_6 = await tokenInstance.getVestingRate(accounts[6]);

 //      assert.equal(vestRate_4.toString(),expectedRate4.toString(),"Rates didn't match for User 4")
 //      assert.equal(vestRate_5.toString(),expectedRate5.toString(),"Rates didn't match for User 5")
 //      assert.equal(vestRate_6.toString(),expectedRate6.toString(),"Rates didn't match for User 6")

 //  })

 //    it("Calculate Claimable Tokens function should work as expected before 60 days cliff ", async()=>{
 //      const expectedClaimableTokens_user4 = ether('300');

 //      const actualClaimableReturn_user4 = await tokenInstance.calculateClaimableTokens(accounts[4]);
 //      console.log(actualClaimableReturn_user4.toString())
 //     // assert.equal(actualClaimableReturn_user4.toString(),expectedClaimableTokens_user4.toString(),"Calcualted Rate is wrong for user 4");

 // })

 //   it("Time should increase by Days", async() =>{
 //    await time.increase(time.duration.days(32));
 //  })
 //   // Time 93 Days Later
 // it("Sale Vesting Rates should be calculated as expected Between 90 to 120 days", async()=>{
 //      const expectedRate4 = ether('15');
 //      const expectedRate5 = ether('20');
 //      const expectedRate6 = ether('30');
     
 //      const vestRate_4 = await tokenInstance.getVestingRate(accounts[4]);
 //      const vestRate_5 = await tokenInstance.getVestingRate(accounts[5]);
 //      const vestRate_6 = await tokenInstance.getVestingRate(accounts[6]);

 //      assert.equal(vestRate_4.toString(),expectedRate4.toString(),"Rates didn't match for User 4")
 //      assert.equal(vestRate_5.toString(),expectedRate5.toString(),"Rates didn't match for User 5")
 //      assert.equal(vestRate_6.toString(),expectedRate6.toString(),"Rates didn't match for User 6")

 //  })



 //   it("Time should increase by Days", async() =>{
 //    await time.increase(time.duration.days(32));
 //  })
 //   // Time 125 Days Later
 // it("Sale Vesting Rates should be calculated as expected Between 120 to 150 days", async()=>{
 //      const expectedRate4 = ether('15');
 //      const expectedRate5 = ether('25');
 //      const expectedRate6 = 0;
     
 //      const vestRate_4 = await tokenInstance.getVestingRate(accounts[4]);
 //      const vestRate_5 = await tokenInstance.getVestingRate(accounts[5]);
 //      const vestRate_6 = await tokenInstance.getVestingRate(accounts[6]);

 //      assert.equal(vestRate_4.toString(),expectedRate4.toString(),"Rates didn't match for User 4")
 //      assert.equal(vestRate_5.toString(),expectedRate5.toString(),"Rates didn't match for User 5")
 //      assert.equal(vestRate_6.toString(),expectedRate6.toString(),"Rates didn't match for User 6")

 //  })


 //   it("Time should increase by Days", async() =>{
 //    await time.increase(time.duration.days(32));
 //  })
 //   // Time 157Days Later
 // it("Sale Vesting Rates should be calculated as expected Between 150 to 213 days", async()=>{
 //      const expectedRate4 = ether('15');
 //      const expectedRate5 = 0;
 //      const expectedRate6 = 0;
     
 //      const vestRate_4 = await tokenInstance.getVestingRate(accounts[4]);
 //      const vestRate_5 = await tokenInstance.getVestingRate(accounts[5]);
 //      const vestRate_6 = await tokenInstance.getVestingRate(accounts[6]);

 //      assert.equal(vestRate_4.toString(),expectedRate4.toString(),"Rates didn't match for User 4")
 //      assert.equal(vestRate_5.toString(),expectedRate5.toString(),"Rates didn't match for User 5")
 //      assert.equal(vestRate_6.toString(),expectedRate6.toString(),"Rates didn't match for User 6")

 //  })

 //  it("Time should increase by Days", async() =>{
 //    await time.increase(time.duration.days(100));
 //  })
 //    // Time 257 days Later
 // it("Sale Vesting Rates should be calculated as expected", async()=>{
 //      const expectedRate4 = 0;
 //      const expectedRate5 = 0;
 //      const expectedRate6 = 0;
     
 //      const vestRate_4 = await tokenInstance.getVestingRate(accounts[4]);
 //      const vestRate_5 = await tokenInstance.getVestingRate(accounts[5]);
 //      const vestRate_6 = await tokenInstance.getVestingRate(accounts[6]);

 //      assert.equal(vestRate_4.toString(),expectedRate4.toString(),"Rates didn't match for User 4")
 //      assert.equal(vestRate_5.toString(),expectedRate5.toString(),"Rates didn't match for User 5")
 //      assert.equal(vestRate_6.toString(),expectedRate6.toString(),"Rates didn't match for User 6")

 //  })

 // it("Time should increase by Days", async() =>{
 //    await time.increase(time.duration.days(120));
 //  })
    // Time 377 days later

 //  it("Calculate Claimable Tokens function should work as expected after cliff ", async()=>{
 //      const expectedClaimableTokens_user1 = ether('100');

 //      const actualClaimableReturn_user1 = await tokenInstance.calculateClaimableTokens(accounts[1]);

 //      assert.equal(actualClaimableReturn_user1.toString(),expectedClaimableTokens_user1.toString(),"Calcualted Rate is wrong for user 1");

 // })
});
