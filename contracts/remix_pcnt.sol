// pragma solidity 0.5.16;
// // SPDX-License-Identifier: MIT

// contract Owned {
//     address public owner;
//     address public nominatedOwner;

//     event OwnerNominated(address newOwner);
//     event OwnerChanged(address oldOwner, address newOwner);

//     constructor(address _owner) public {
//         require(_owner != address(0), "Owner address cannot be 0");
//         owner = _owner;
//         emit OwnerChanged(address(0), _owner);
//     }

//     function nominateNewOwner(address _owner) external onlyOwner {
//         nominatedOwner = _owner;
//         emit OwnerNominated(_owner);
//     }

//     function acceptOwnership() external {
//         require(msg.sender == nominatedOwner, "You must be nominated before you can accept ownership");
//         emit OwnerChanged(owner, nominatedOwner);
//         owner = nominatedOwner;
//         nominatedOwner = address(0);
//     }

//     modifier onlyOwner {
//         _onlyOwner();
//         _;
//     }

//     function _onlyOwner() private view {
//         require(msg.sender == owner, "Only the contract owner may perform this action");
//     }
// }



// /**
//  * @dev Interface of the ERC20 standard as defined in the EIP. Does not include
//  * the optional functions; to access them see `ERC20Detailed`.
//  */
// interface IERC20 {
//   /**
//     * @dev Returns the amount of tokens in existence.
//     */
//   function totalSupply() external view returns (uint256);

//   /**
//     * @dev Returns the amount of tokens owned by `account`.
//     */
//   function balanceOf(address account) external view returns (uint256);

//   /**
//     * @dev Moves `amount` tokens from the caller's account to `recipient`.
//     *
//     * Returns a boolean value indicating whether the operation succeeded.
//     *
//     * Emits a `Transfer` event.
//     */
//   function transfer(address recipient, uint256 amount) external returns (bool);

//   /**
//     * @dev Returns the remaining number of tokens that `spender` will be
//     * allowed to spend on behalf of `owner` through `transferFrom`. This is
//     * zero by default.
//     *
//     * This value changes when `approve` or `transferFrom` are called.
//     */
//   function allowance(address owner, address spender) external view returns (uint256);

//   /**
//     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
//     *
//     * Returns a boolean value indicating whether the operation succeeded.
//     *
//     * > Beware that changing an allowance with this method brings the risk
//     * that someone may use both the old and the new allowance by unfortunate
//     * transaction ordering. One possible solution to mitigate this race
//     * condition is to first reduce the spender's allowance to 0 and set the
//     * desired value afterwards:
//     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
//     *
//     * Emits an `Approval` event.
//     */
//   function approve(address spender, uint256 amount) external returns (bool);

//   /**
//     * @dev Moves `amount` tokens from `sender` to `recipient` using the
//     * allowance mechanism. `amount` is then deducted from the caller's
//     * allowance.
//     *
//     * Returns a boolean value indicating whether the operation succeeded.
//     *
//     * Emits a `Transfer` event.
//     */
//   function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

//   /**
//     * @dev Emitted when `value` tokens are moved from one account (`from`) to
//     * another (`to`).
//     *
//     * Note that `value` may be zero.
//     */
//   event Transfer(address indexed from, address indexed to, uint256 value);

//   /**
//     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
//     * a call to `approve`. `value` is the new allowance.
//     */
//   event Approval(address indexed owner, address indexed spender, uint256 value);
// }

// // File: openzeppelin-solidity/contracts/math/SafeMath.sol

// /**
//  * @dev Wrappers over Solidity's arithmetic operations with added overflow
//  * checks.
//  *
//  * Arithmetic operations in Solidity wrap on overflow. This can easily result
//  * in bugs, because programmers usually assume that an overflow raises an
//  * error, which is the standard behavior in high level programming languages.
//  * `SafeMath` restores this intuition by reverting the transaction when an
//  * operation overflows.
//  *
//  * Using this library instead of the unchecked operations eliminates an entire
//  * class of bugs, so it's recommended to use it always.
//  */
// library SafeMath {
//   /**
//     * @dev Returns the addition of two unsigned integers, reverting on
//     * overflow.
//     *
//     * Counterpart to Solidity's `+` operator.
//     *
//     * Requirements:
//     * - Addition cannot overflow.
//     */
//   function add(uint256 a, uint256 b) internal pure returns (uint256) {
//       uint256 c = a + b;
//       require(c >= a, "SafeMath: addition overflow");

//       return c;
//   }

//   /**
//     * @dev Returns the subtraction of two unsigned integers, reverting on
//     * overflow (when the result is negative).
//     *
//     * Counterpart to Solidity's `-` operator.
//     *
//     * Requirements:
//     * - Subtraction cannot overflow.
//     */
//   function sub(uint256 a, uint256 b) internal pure returns (uint256) {
//       require(b <= a, "SafeMath: subtraction overflow");
//       uint256 c = a - b;

//       return c;
//   }

//   /**
//     * @dev Returns the multiplication of two unsigned integers, reverting on
//     * overflow.
//     *
//     * Counterpart to Solidity's `*` operator.
//     *
//     * Requirements:
//     * - Multiplication cannot overflow.
//     */
//   function mul(uint256 a, uint256 b) internal pure returns (uint256) {
//       // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
//       // benefit is lost if 'b' is also tested.
//       // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
//       if (a == 0) {
//           return 0;
//       }

//       uint256 c = a * b;
//       require(c / a == b, "SafeMath: multiplication overflow");

//       return c;
//   }

//   /**
//     * @dev Returns the integer division of two unsigned integers. Reverts on
//     * division by zero. The result is rounded towards zero.
//     *
//     * Counterpart to Solidity's `/` operator. Note: this function uses a
//     * `revert` opcode (which leaves remaining gas untouched) while Solidity
//     * uses an invalid opcode to revert (consuming all remaining gas).
//     *
//     * Requirements:
//     * - The divisor cannot be zero.
//     */
//   function div(uint256 a, uint256 b) internal pure returns (uint256) {
//       // Solidity only automatically asserts when dividing by 0
//       require(b > 0, "SafeMath: division by zero");
//       uint256 c = a / b;
//       // assert(a == b * c + a % b); // There is no case in which this doesn't hold

//       return c;
//   }

// }

// // File: openzeppelin-solidity/contracts/token/ERC20/ERC20.sol

// /**
//  * @dev Implementation of the `IERC20` interface.
//  *
//  * This implementation is agnostic to the way tokens are created. This means
//  * that a supply mechanism has to be added in a derived contract using `_mint`.
//  * For a generic mechanism see `ERC20Mintable`.
//  *
//  * *For a detailed writeup see our guide [How to implement supply
//  * mechanisms](https://forum.zeppelin.solutions/t/how-to-implement-erc20-supply-mechanisms/226).*
//  *
//  * We have followed general OpenZeppelin guidelines: functions revert instead
//  * of returning `false` on failure. This behavior is nonetheless conventional
//  * and does not conflict with the expectations of ERC20 applications.
//  *
//  * Additionally, an `Approval` event is emitted on calls to `transferFrom`.
//  * This allows applications to reconstruct the allowance for all accounts just
//  * by listening to said events. Other implementations of the EIP may not emit
//  * these events, as it isn't required by the specification.
//  *
//  * Finally, the non-standard `decreaseAllowance` and `increaseAllowance`
//  * functions have been added to mitigate the well-known issues around setting
//  * allowances. See `IERC20.approve`.
//  */

// /**
//  * @dev Optional functions from the ERC20 standard.
//  */
// contract ERC20Detailed is IERC20 {
//     string private _name;
//     string private _symbol;
//     uint8 private _decimals;

//     /**
//      * @dev Sets the values for `name`, `symbol`, and `decimals`. All three of
//      * these values are immutable: they can only be set once during
//      * construction.
//      */
//     constructor (string memory name, string memory symbol, uint8 decimals) public {
//         _name = name;
//         _symbol = symbol;
//         _decimals = decimals;
//     }

//     /**
//      * @dev Returns the name of the token.
//      */
//     function name() public view returns (string memory) {
//         return _name;
//     }

//     /**
//      * @dev Returns the symbol of the token, usually a shorter version of the
//      * name.
//      */
//     function symbol() public view returns (string memory) {
//         return _symbol;
//     }

//     /**
//      * @dev Returns the number of decimals used to get its user representation.
//      * For example, if `decimals` equals `2`, a balance of `505` tokens should
//      * be displayed to a user as `5,05` (`505 / 10 ** 2`).
//      *
//      * Tokens usually opt for a value of 18, imitating the relationship between
//      * Ether and Wei.
//      *
//      * NOTE: This information is only used for _display_ purposes: it in
//      * no way affects any of the arithmetic of the contract, including
//      * {IERC20-balanceOf} and {IERC20-transfer}.
//      */
//     function decimals() public view returns (uint8) {
//         return _decimals;
//     }
// }

// contract ERC20 is IERC20 {
//   using SafeMath for uint256;

//   mapping (address => uint256) private _balances;

//   mapping (address => mapping (address => uint256)) private _allowances;

//   uint256 private _totalSupply;

//   /**
//     * @dev See `IERC20.totalSupply`.
//     */
//   function totalSupply() public view returns (uint256) {
//     return _totalSupply;
//   }

//   /**
//     * @dev See `IERC20.balanceOf`.
//     */
//   function balanceOf(address account) public view returns (uint256) {
//     return _balances[account];
//   }


//   /**
//     * @dev See `IERC20.allowance`.
//     */
//   function allowance(address owner, address spender) public view returns (uint256) {
//     return _allowances[owner][spender];
//   }

//   /**
//     * @dev See `IERC20.approve`.
//     *
//     * Requirements:
//     *
//     * - `spender` cannot be the zero address.
//     */
//   function approve(address spender, uint256 value) external returns (bool) {
//     _approve(msg.sender, spender, value);
//     return true;
//   }


//   /**
//     * @dev Atomically increases the allowance granted to `spender` by the caller.
//     *
//     * This is an alternative to `approve` that can be used as a mitigation for
//     * problems described in `IERC20.approve`.
//     *
//     * Emits an `Approval` event indicating the updated allowance.
//     *
//     * Requirements:
//     *
//     * - `spender` cannot be the zero address.
//     */
//   function increaseAllowance(address spender, uint256 addedValue) external returns (bool) {
//     _approve(msg.sender, spender, _allowances[msg.sender][spender].add(addedValue));
//     return true;
//   }

//   /**
//     * @dev Atomically decreases the allowance granted to `spender` by the caller.
//     *
//     * This is an alternative to `approve` that can be used as a mitigation for
//     * problems described in `IERC20.approve`.
//     *
//     * Emits an `Approval` event indicating the updated allowance.
//     *
//     * Requirements:
//     *
//     * - `spender` cannot be the zero address.
//     * - `spender` must have allowance for the caller of at least
//     * `subtractedValue`.
//     */
//   function decreaseAllowance(address spender, uint256 subtractedValue) external returns (bool) {
//     _approve(msg.sender, spender, _allowances[msg.sender][spender].sub(subtractedValue));
//     return true;
//   }

//   /**
//     * @dev Moves tokens `amount` from `sender` to `recipient`.
//     *
//     * This is internal function is equivalent to `transfer`, and can be used to
//     * e.g. implement automatic token fees, slashing mechanisms, etc.
//     *
//     * Emits a `Transfer` event.
//     *
//     * Requirements:
//     *
//     * - `sender` cannot be the zero address.
//     * - `recipient` cannot be the zero address.
//     * - `sender` must have a balance of at least `amount`.
//     */
    
//        function transfer(address recipient, uint256 amount) public returns (bool) {
//         _transfer(msg.sender, recipient, amount);
//         return true;
//     }
//   function _transfer(address sender, address recipient, uint256 amount) public {
//     require(sender != address(0), "ERC20: transfer from the zero address");
//     require(recipient != address(0), "ERC20: transfer to the zero address");

//     _balances[sender] = _balances[sender].sub(amount);
//     _balances[recipient] = _balances[recipient].add(amount);
//     emit Transfer(sender, recipient, amount);
//   }

//   /** @dev Creates `amount` tokens and assigns them to `account`, increasing
//     * the total supply.
//     *
//     * Emits a `Transfer` event with `from` set to the zero address.
//     *
//     * Requirements
//     *
//     * - `to` cannot be the zero address.
//     */
//   function _mint(address account, uint256 amount) internal {
//     require(account != address(0), "ERC20: mint to the zero address");

//     _totalSupply = _totalSupply.add(amount);
//     _balances[account] = _balances[account].add(amount);
//     emit Transfer(address(0), account, amount);
//   }

//     /**
//     * @dev Destoys `amount` tokens from `account`, reducing the
//     * total supply.
//     *
//     * Emits a `Transfer` event with `to` set to the zero address.
//     *
//     * Requirements
//     *
//     * - `account` cannot be the zero address.
//     * - `account` must have at least `amount` tokens.
//     */
//   function _burn(address account, uint256 value) internal {
//     require(account != address(0), "ERC20: burn from the zero address");

//     _totalSupply = _totalSupply.sub(value);
//     _balances[account] = _balances[account].sub(value);
//     emit Transfer(account, address(0), value);
//   }

//   /**
//     * @dev See `IERC20.transferFrom`.
//     *
//     * Emits an `Approval` event indicating the updated allowance. This is not
//     * required by the EIP. See the note at the beginning of `ERC20`;
//     *
//     * Requirements:
//     * - `sender` and `recipient` cannot be the zero address.
//     * - `sender` must have a balance of at least `value`.
//     * - the caller must have allowance for `sender`'s tokens of at least
//     * `amount`.
//     */
    
//        function transferFrom(address sender, address recipient, uint256 amount) public returns (bool) {
//         _transfer(sender, recipient, amount);
//         _approve(sender, msg.sender, _allowances[sender][msg.sender].sub(amount));
//         return true;
//     }
//   function _transferFrom(address sender, address recipient, uint256 amount) internal returns (bool) {
//     _transfer(sender, recipient, amount);
//     _approve(sender, msg.sender, _allowances[sender][msg.sender].sub(amount));
//     return true;
//   }


//   /**
//     * @dev Sets `amount` as the allowance of `spender` over the `owner`s tokens.
//     *
//     * This is internal function is equivalent to `approve`, and can be used to
//     * e.g. set automatic allowances for certain subsystems, etc.
//     *
//     * Emits an `Approval` event.
//     *
//     * Requirements:
//     *
//     * - `owner` cannot be the zero address.
//     * - `spender` cannot be the zero address.
//     */
//   function _approve(address owner, address spender, uint256 value) internal {
//     require(owner != address(0), "ERC20: approve from the zero address");
//     require(spender != address(0), "ERC20: approve to the zero address");

//     _allowances[owner][spender] = value;
//     emit Approval(owner, spender, value);
//   }

// }
// contract PlayToken is ERC20,ERC20Detailed,Owned{
// 	using SafeMath for uint;
// 	/**
// 	 * Category 0 - Team
// 	 * Category 1 - Operations
// 	 * Category 2 - Marketing/Partners
// 	 * Category 3 - Advisors
// 	 * Category 4 - Reserve
// 	 * Category 5 - Seed Sale
// 	 * Category 6 - Private 1
// 	 * Category 7 - Private 2
// 	 */
// 	struct vestingDetails{
// 		uint8 categoryId;
// 		uint cliff;
// 		uint lockUpPeriod;
// 		uint vestPercentage;
// 		uint totalAllocatedToken;
// 	}

// 	struct vestAccountDetails{
// 		uint8 categoryId;
// 		address walletAddress;
// 		uint totalAmount;
// 		uint startTime;
// 		uint vestingDuration;
// 		uint vestingCliff;
// 		uint vestPercent;
// 		uint totalMonthsClaimed;
// 		uint totalAmountClaimed;
// 		bool isVesting;
// 	}

// 	mapping (uint => vestingDetails) public vestCategory;
// 	mapping(address => vestAccountDetails) public userToVestingDetails;


// 	 constructor(address _owner) 
// 	 ERC20Detailed("Playcent","PCNT",18)
//      Owned(_owner) 
//      public{
	
// 		super._mint(_owner,60000000 ether);
 		
//  		vestCategory[0] = vestingDetails(0,365 days,973 days,5000000000000000000,9000000 ether); // Team
// 		vestCategory[1] = vestingDetails(1,91 days, 395 days,10000000000000000000,4800000 ether); // Operations
// 		vestCategory[2] = vestingDetails(2,91 days, 395 days,10000000000000000000,4800000 ether); // Marketing/Partners
// 		vestCategory[3] = vestingDetails(3,30 days, 334 days,10000000000000000000,2400000 ether); // Advisors
// 		vestCategory[4] = vestingDetails(4,213 days, 334 days,10000000000000000000,4800000 ether); //Staking/Early Incentive Rewards
// 		vestCategory[5] = vestingDetails(5,91 days, 852 days,4000000000000000000,9000000 ether); //Play Mining	
// 		vestCategory[6] = vestingDetails(5,182 days, 912 days,1000000000000000000,4200000 ether); //Reserve	
// 		// V
// 		vestCategory[7] = vestingDetails(5,60 days,213 days,10000000000000000000,5700000 ether); // Seed Sale
// 		vestCategory[8] = vestingDetails(6,60 days,150 days,15000000000000000000,5400000 ether); // Private Sale 1
// 		vestCategory[9] = vestingDetails(7,60 days,120 days,20000000000000000000,5100000 ether); // Private Sale 2
// 	}

// 	modifier onlyValidVestingBenifciary(address _userAddresses,uint8 _vestingIndex) { 
// 		require(_vestingIndex >= 0 && _vestingIndex <= 9,"Invalid Vesting Index");		  
// 		require (_userAddresses != address(0),"Invalid Address");
// 		require (!userToVestingDetails[_userAddresses].isVesting,"User Vesting Details Already Added");
// 		_; 
// 	}
// 		/**
// 	 * @notice - Allows only the Owner to ADD an array of Addresses as well as their Vesting Amount
// 	 		   - The array of user and amounts should be passed along with the vestingCategory Index. 
// 	 		   - Thus, a particular batch of addresses shall be added under only one Vesting Category Index 
// 	 * @param _userAddresses array of addresses of the Users
// 	 * @param _vestingAmounts array of amounts to be vested
// 	 * @param _vestnigType allows the owner to select the type of vesting category
// 	 * @return - returns TRUE if Function executes successfully
// 	 */

// 	function addVestingDetails(address[] memory _userAddresses, uint256[] memory _vestingAmounts, uint8 _vestnigType) public onlyOwner returns(bool){
// 		require(_vestnigType >= 0 && _vestnigType <= 9,"Invalid Vesting Index");
// 		require(_userAddresses.length == _vestingAmounts.length,"Unequal arrays passed");

// 		vestingDetails memory vestData = vestCategory[_vestnigType];
// 		uint arrayLength = _userAddresses.length;

// 		for(uint i= 0; i< arrayLength; i++){
// 			uint8 categoryId = _vestnigType;
// 			address user = _userAddresses[i];
// 			uint256 amount = _vestingAmounts[i];
// 			uint256 vestingDuration = vestData.lockUpPeriod;
// 			uint256 vestingCliff = vestData.cliff;
// 			uint256 vestPercent = vestData.vestPercentage;


// 			addUserVestingDetails(user,categoryId,amount,vestingCliff,vestingDuration,vestPercent);
// 		}
// 		return true;
// 	}


// 	/** @notice - Internal functions that is initializes the vestAccountDetails Struct with the respective arguments passed
// 	 * @param _userAddresses addresses of the User
// 	 * @param _totalAmount total amount to be lockedUp
// 	 * @param _categoryId denotes the type of vesting selected
// 	 * @param _vestingCliff denotes the cliff of the vesting category selcted
// 	 * @param _vestingDuration denotes the total duration of the vesting category selcted
// 	 * @param _vestPercent denotes the percentage of total amount to be vested after cliff period
// 	 * @return - returns TRUE if Function executes successfully
// 	 */
	 
// 	function addUserVestingDetails(address _userAddresses, uint8 _categoryId, uint256 _totalAmount, uint256 _vestingCliff, uint256 _vestingDuration,uint256 _vestPercent) onlyValidVestingBenifciary(_userAddresses,_categoryId) internal{	
// 		vestAccountDetails memory userVestingData = vestAccountDetails(
// 			_categoryId,
// 			_userAddresses,
// 			_totalAmount,
// 			block.timestamp,
// 			_vestingDuration,
// 			_vestingCliff,
// 			_vestPercent,
// 			0,
// 			0,
// 			true	
// 		);
// 		userToVestingDetails[_userAddresses] = userVestingData;
// 	}

// 	/**
// 	 * @notice Returns the Variable Rate of Vest depending on the no. of months passed
// 	 * @param user of the User  
// 	 */
// 	function _getSaleVestRate(address user) internal view returns(uint256){
// 		vestAccountDetails memory vestingData = userToVestingDetails[user];
// 		uint8 category = vestingData.categoryId;
// 		//Check whether the category id is of any particular Sale(Seed,Private 1 or Private 2)
// 		require(category >= 5 && category <= 7,"Invalid Sale Vest Index");

// 		uint256 currentTime = block.timestamp;
// 		uint256 userStartTime = vestingData.startTime;
// 		uint256 timeElapsed = currentTime.sub(userStartTime);

// 		uint256 currentVestRate;

// 		if(category == 7){
//             if(timeElapsed > 60 days && timeElapsed <= 213 days ){
//             	currentVestRate = 15000000000000000000;
//             }
// 		}
// 		if(category == 8){
//             if(timeElapsed > 60 days && timeElapsed <= 120 days ){
//             	currentVestRate = 20000000000000000000;
//             }else if(timeElapsed > 120 days && timeElapsed <= 150 days ){
//             	currentVestRate = 25000000000000000000;
//             }
// 		}
// 		if(category == 9){
//             if(timeElapsed > 60 days && timeElapsed <= 90 days ){
//             	currentVestRate = 20000000000000000000;
//             }else if(timeElapsed > 90 days && timeElapsed <= 120 days ){
//             	currentVestRate = 30000000000000000000;
//             }
// 		}
// 		return currentVestRate;
// 	}
	
// }