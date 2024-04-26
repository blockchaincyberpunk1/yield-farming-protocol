// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Token
 * @dev Implementation of the ERC20 Token for yield farming rewards.
 * This ERC20 token allows for minting (creation of new tokens), which can be controlled
 * by the owner or other privileged roles (typically the yield farming contract).
 */
contract Token is ERC20, Ownable {
    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     * @param name The name of the token.
     * @param symbol The symbol of the token.
     * @param initialSupply The amount of tokens that will be minted upon creation.
     */
    constructor(string memory name, string memory symbol, uint256 initialSupply) ERC20(name, symbol) Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
    }

    /**
     * @dev Function to mint tokens
     * @param to The address that will receive the minted tokens.
     * @param amount The amount of tokens to mint.
     * Only the owner can call this function (or another role if extended).
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
