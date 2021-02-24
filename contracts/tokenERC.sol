pragma solidity 0.6.2;
// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/math/SafeMathUpgradeable.sol";


contract PlayToken is Initializable,OwnableUpgradeable,ERC20PausableUpgradeable{
	using SafeMathUpgradeable for uint;
	/**
	 * Category 0 - Team
	 * Category 1 - Operations
	 * Category 2 - Marketing/Partners
	 * Category 3 - Advisors
	 * Category 4 - Staking/Earn Incentives
	 * Category 5 - Play/Mining
	 * Category 6 - Reserve
	 * Category 7 - Seed Sale
	 * Category 8 - Private 1
	 * Category 9 - Private 2
	 */
	struct vestingDetails{
		uint8 categoryId;
		uint cliff;
		uint lockUpPeriod;
		uint vestPercentage;
		uint totalAllocatedToken;
	}

	struct vestAccountDetails{
		uint8 categoryId;
		address walletAddress;
		uint totalAmount;
		uint startTime;
		uint vestingDuration;
		uint vestingCliff;
		uint vestingPercent;
		uint totalMonthsClaimed;
		uint totalAmountClaimed;
		bool isVesting;
	}

	mapping (uint => vestingDetails) public vestCategory;
	mapping(address => vestAccountDetails) public userToVestingDetails;
	
	function initialize() initializer public{
		__Ownable_init();
        __ERC20_init('Playcent','PCNT');		
		__ERC20Pausable_init();
		_mint(owner(),60000000 ether);
 		
 		vestCategory[0] = vestingDetails(0,365 days,973 days,5000000000000000000,9000000 ether); // Team
		vestCategory[1] = vestingDetails(1,91 days, 395 days,10000000000000000000,4800000 ether); // Operations
		vestCategory[2] = vestingDetails(2,91 days, 395 days,10000000000000000000,4800000 ether); // Marketing/Partners
		vestCategory[3] = vestingDetails(3,30 days, 334 days,10000000000000000000,2400000 ether); // Advisors
		vestCategory[4] = vestingDetails(4,213 days, 334 days,10000000000000000000,4800000 ether); //Staking/Early Incentive Rewards
		vestCategory[5] = vestingDetails(5,91 days, 852 days,4000000000000000000,9000000 ether); //Play Mining	
		vestCategory[6] = vestingDetails(5,182 days, 912 days,1000000000000000000,4200000 ether); //Reserve	
		// Sale Vesting Strategies
		vestCategory[7] = vestingDetails(5,60 days,213 days,10000000000000000000,5700000 ether); // Seed Sale
		vestCategory[8] = vestingDetails(6,60 days,150 days,15000000000000000000,5400000 ether); // Private Sale 1
		vestCategory[9] = vestingDetails(7,60 days,120 days,20000000000000000000,5100000 ether); // Private Sale 2
	}


	modifier onlyValidVestingBenifciary(address _userAddresses,uint8 _vestingIndex) { 
		require(_vestingIndex >= 0 && _vestingIndex <= 9,"Invalid Vesting Index");		  
		require (_userAddresses != address(0),"Invalid Address");
		require (!userToVestingDetails[_userAddresses].isVesting,"User Vesting Details Already Added");
		_; 
	}

	modifier checkVestingStatus(address _userAddresses){ 
	 	require (userToVestingDetails[_userAddresses].isVesting,"User NOT added to any Vesting Category");
		_; 
	}

	function getCurrentTime() public view returns(uint256){
		return block.timestamp;
	}	

	function monthInSeconds() internal view returns(uint256){		
		return 2592000;
	}
	
	function daysInSeconds() internal view returns(uint256){		
		return 86400;
	}
	/**
	 * @notice - Allows only the Owner to ADD an array of Addresses as well as their Vesting Amount
	 		   - The array of user and amounts should be passed along with the vestingCategory Index. 
	 		   - Thus, a particular batch of addresses shall be added under only one Vesting Category Index 
	 * @param _userAddresses array of addresses of the Users
	 * @param _vestingAmounts array of amounts to be vested
	 * @param _vestnigType allows the owner to select the type of vesting category
	 * @return - true if Function executes successfully
	 */

	function addVestingDetails(address[] calldata _userAddresses, uint256[] calldata _vestingAmounts, uint8 _vestnigType) external onlyOwner returns(bool){
		require(_vestnigType >= 0 && _vestnigType <= 9,"Invalid Vesting Index");
		require(_userAddresses.length == _vestingAmounts.length,"Unequal arrays passed");

		vestingDetails memory vestData = vestCategory[_vestnigType];
		uint arrayLength = _userAddresses.length;

		for(uint i= 0; i<arrayLength; i++){
			uint8 categoryId = _vestnigType;
			address user = _userAddresses[i];
			uint256 amount = _vestingAmounts[i];
			uint256 vestingDuration = vestData.lockUpPeriod;
			uint256 vestingCliff = vestData.cliff;
			uint256 vestPercent = vestData.vestPercentage;


			addUserVestingDetails(user,categoryId,amount,vestingCliff,vestingDuration,vestPercent);
		}
		return true;
	}


	/** @notice - Internal functions that is initializes the vestAccountDetails Struct with the respective arguments passed
	 * @param _userAddresses addresses of the User
	 * @param _totalAmount total amount to be lockedUp
	 * @param _categoryId denotes the type of vesting selected
	 * @param _vestingCliff denotes the cliff of the vesting category selcted
	 * @param _vestingDuration denotes the total duration of the vesting category selcted
	 * @param _vestPercent denotes the percentage of total amount to be vested after cliff period
	 */
	 
	function addUserVestingDetails(address _userAddresses, uint8 _categoryId, uint256 _totalAmount, uint256 _vestingCliff, uint256 _vestingDuration,uint256 _vestPercent) onlyValidVestingBenifciary(_userAddresses,_categoryId) internal{	
		vestAccountDetails memory userVestingData = vestAccountDetails(
			_categoryId,
			_userAddresses,
			_totalAmount,
			block.timestamp,
			_vestingDuration,
			_vestingCliff,
			_vestPercent,
			0,
			0,
			true	
		);
		userToVestingDetails[_userAddresses] = userVestingData;
	}

	/**
	 * @notice Calculates the Variable Rate of Vest depending on the amount of time(months) elapsed
	 * @param user address of the User  
	 */
	function _getSaleVestRate(address user) internal view returns(uint256){
		vestAccountDetails memory vestingData = userToVestingDetails[user];
		uint8 category = vestingData.categoryId;
		//Check whether the category id is of any particular Sale(Seed,Private 1 or Private 2)
		require(category >= 7 && category <= 9,"Invalid Sale Vest Index");

		uint256 currentTime = getCurrentTime();
		uint256 userStartTime = vestingData.startTime;
		uint256 timeElapsed = currentTime.sub(userStartTime);
		uint256 oneDayInSeconds = daysInSeconds();

		uint256 timeElapsedInDays = timeElapsed.div(oneDayInSeconds);
		uint256 currentVestRate;

		if(category == 7){
            if(timeElapsedInDays > 60 && timeElapsedInDays <= 213 ){
            	currentVestRate = 15000000000000000000;
            }
		}
		if(category == 8){
            if(timeElapsedInDays > 60 && timeElapsedInDays <= 120 ){
            	currentVestRate = 20000000000000000000;
            }else if(timeElapsedInDays > 120 && timeElapsedInDays <= 150 ){
            	currentVestRate = 25000000000000000000;
            }
		}
		if(category == 9){
            if(timeElapsedInDays > 60 && timeElapsedInDays <= 90 ){
            	currentVestRate = 20000000000000000000;
            }else if(timeElapsedInDays > 90 && timeElapsedInDays <= 120 ){
            	currentVestRate = 30000000000000000000;
            }
		}
		return currentVestRate;
	}

	function getVestingRate(address _userAddresses) public checkVestingStatus(_userAddresses) view returns(uint256){
		uint256 vestRate;
		vestAccountDetails memory vestData = userToVestingDetails[_userAddresses];

		if(vestData.categoryId <= 6){
	 		vestRate = vestData.vestingPercent;
	 	}else{
	 		vestRate = _getSaleVestRate();
	 	}

	 	return vestRate;
	}
	
   /**
	 * @notice Calculates the amount of tokens to be transferred at any given point of time
	 * @param user address of the User  
	 */

	 function calculateClaimableTokens(address _userAddresses) public checkVestingStatus(_userAddresses) returns(uint256){	 	
	 	// Get Vesting Details
	 	vestAccountDetails memory vestData = userToVestingDetails[_userAddresses];
	 	
	 	uint256 vestRate;
	 	uint256 totalClaimableAmount;
	 	uint256 vestStartTime = vestData.startTime;
	 	uint256 currentTime = getCurrentTime();
	 	uint256 vestCliff = vestStartTime.add(vestData.vestingCliff);
	 	uint256 vestDuration = vestStartTime.add(vestData.vestingDuration);
	 	
	 	
	 	uint256 timeElapsed = currentTime.sub(vestStartTime);
	 	uint256 oneMonthInSeconds = monthInSeconds();

		vestRate = getVestingRate();
	 	// Finally check the Claimable Amount by comparing the timeElapsed with the Current Time

	 	if(currentTime < vestCliff){  // If Vesting Cliff is not reached yet
	 		return 0;
	 	}else if(currentTime > vestDuration){ // If total duration of Vesting already crossed
	 		uint256 amountPerMonth = (vestData.totalAmount.mul(vestRate)).div(100000000000000000000);
	 		uint256 totalDuration = vestData.vestingDuration.div(oneMonthInSeconds);
	 		totalClaimableAmount = (amountPerMonth.mul(totalDuration)).sub(vestData.totalAmountClaimed);
	 	}else{ // if current time has crossed the Vesting Cliff but not the total Vesting Duration
	 		uint256 amountPerMonth = (vestData.totalAmount.mul(vestRate)).div(100000000000000000000);
	 		uint256 totalMonthsElapsed = timeElapsed.div(oneMonthInSeconds);
	 		totalClaimableAmount = (amountPerMonth.mul(totalMonthsElapsed)).sub(vestData.totalAmountClaimed);
	 	}

	 }
	 
	function sendTokens(address _beneficiary, uint256 _amountOfTokens) external returns(bool){
		super.transfer(_beneficiary,_amountOfTokens);
		return true;
	}
	
	
}