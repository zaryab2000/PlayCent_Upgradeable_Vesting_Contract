pragma solidity 0.6.2;

import "./VestTokenV1.sol";

contract VestTokenV2 is VestTokenV1
{
	 /**
     * @notice - An additional function for Version2 of the VestToken that mints additional tokens and transfers to the owner of the contract
     */
	 function initializeV2() public initializer {
   	
   	 _mint(owner(), 9000000 ether);

  }

}